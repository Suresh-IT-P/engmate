const { Server } = require('socket.io');
const db = require('../config/db');

const QUESTIONS_PER_MATCH = 10;

/** Seconds per question. The host picks a value inside this range. */
const MIN_SECONDS = 5;
const MAX_SECONDS = 60;
const DEFAULT_SECONDS = 10;

/** Pause between the reveal and the next question. */
const REVEAL_MS = 2600;

const clampSeconds = (value) => {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return DEFAULT_SECONDS;
  return Math.max(MIN_SECONDS, Math.min(MAX_SECONDS, n));
};

/** Light, always-friendly commentary. Nothing here mocks a wrong answer. */
const BANTER = {
  firstCorrect: [
    '⚡ {name} got there first!',
    '🎯 {name} locked it in — bullseye!',
    '🚀 Too quick! {name} takes the round.',
    '🔥 {name} is on fire!'
  ],
  bothCorrect: [
    '🤝 Both of you nailed it!',
    '😮 Dead heat — everyone got it right!',
    '👏 Nobody blinked. Both correct!'
  ],
  nobodyCorrect: [
    '😅 That one got everybody.',
    '🤔 Tricky! Nobody caught it.',
    '📚 One for the mistake notebook.'
  ],
  streak: [
    '🌟 {name} is on a {n}-answer streak!',
    '🏆 {n} in a row for {name}!',
    '💫 {name} cannot be stopped — {n} straight!'
  ],
  timeout: [
    '⏰ Time! The clock wins that one.',
    '😬 Too slow — the timer got there first.'
  ],
  gameStart: [
    "🎬 Here we go — good luck, both of you!",
    '🥊 Gloves on. May the best grammarian win!',
    '🎮 Match on! Play fair, type faster.'
  ],
  victory: [
    '🎉 {name} takes the crown!',
    '👑 {name} wins it!',
    '🏅 That is game — {name} on top!'
  ],
  draw: [
    '🤯 A perfect tie! Rematch?',
    '⚖️ All square. Somebody break the deadlock!'
  ]
};

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const say = (kind, vars = {}) =>
  pick(BANTER[kind]).replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));

/** Used only if the database has no battle bank seeded yet. */
const FALLBACK_QUESTIONS = [
  {
    q: "Identify the correct indirect speech: 'I have done my homework,' said Raj.",
    options: [
      "Raj said that he had done his homework.",
      "Raj said that he has done his homework.",
      "Raj said that he did his homework.",
      "Raj told that he done his homework."
    ],
    ans: 0
  },
  {
    q: "What is the correct passive voice? 'The cat chased the mouse.'",
    options: [
      "The mouse was chased by the cat.",
      "The mouse is chased by the cat.",
      "The mouse had been chased by the cat.",
      "The mouse chased the cat."
    ],
    ans: 0
  },
  {
    q: "Select the correct form: 'If I _____ a bird, I would fly.'",
    options: ["am", "was", "were", "be"],
    ans: 2
  }
];

/**
 * Draw a match's worth of questions for a topic. Questions are pulled once at
 * the start of a game and held on the room, so every player sees the same set
 * and the answers never travel to the client.
 */
async function loadQuestions(topicId, count = QUESTIONS_PER_MATCH) {
  try {
    const useTopic = topicId && topicId !== 'mixed';
    const rows = await db.query(
      `SELECT question_text, option_a, option_b, option_c, option_d, answer_index, explanation
         FROM battle_questions
        ${useTopic ? 'WHERE topic_id = ?' : ''}
        ORDER BY RAND() LIMIT ?`,
      useTopic ? [topicId, count] : [count]
    );
    if (!rows.length) return FALLBACK_QUESTIONS;
    return rows.map((r) => ({
      q: r.question_text,
      options: [r.option_a, r.option_b, r.option_c, r.option_d],
      ans: r.answer_index,
      explanation: r.explanation
    }));
  } catch (err) {
    console.warn('[Socket] Could not load battle questions:', err.message);
    return FALLBACK_QUESTIONS;
  }
}

// In-memory store for game rooms
// Room structure: { players: [{id, name, score}], state: 'LOBBY'|'PLAYING'|'FINISHED', currentQuestionIndex: 0, answers: [] }
const rooms = {};

function initGameSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Vite frontend
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // Create Room
    socket.on('create_room', ({
      playerName, sessionId,
      topic = 'mixed', topicTitle = 'Mixed Challenge',
      secondsPerQuestion = DEFAULT_SECONDS,
      questionCount = QUESTIONS_PER_MATCH
    }) => {
      const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
      rooms[roomId] = {
        players: [{ id: socket.id, sessionId, name: playerName, score: 0, streak: 0, connected: true }],
        state: 'LOBBY',
        currentQuestionIndex: 0,
        answeredCount: 0,
        topic,
        topicTitle,
        secondsPerQuestion: clampSeconds(secondsPerQuestion),
        questionCount: Math.max(3, Math.min(25, parseInt(questionCount, 10) || QUESTIONS_PER_MATCH)),
        questions: [],
        roundToken: 0,
        roundTimer: null,
        hostSessionId: sessionId,
        disconnectTimeouts: {}
      };

      socket.join(roomId);
      socket.emit('room_created', roomMeta(roomId, rooms[roomId]));
    });

    // Join Room
    socket.on('join_room', ({ roomId, playerName, sessionId }) => {
      const room = rooms[roomId];
      if (!room) {
        return socket.emit('error', 'Room not found.');
      }

      // A player we already know is not a newcomer — they are the same person
      // arriving on a new socket. Phones do this constantly (screen lock, a
      // WiFi/cellular handover, backgrounding the browser), and every one of
      // those gets a brand new socket id.
      //
      // This used to fall through to the `find` below, match, and then do
      // nothing at all: no socket.join, so the new socket was never in the
      // room and received none of its broadcasts, and no reply, so the client
      // sat on "CONNECTING" forever. Desktops rarely drop, which is why this
      // only ever showed up on phones.
      const returning = room.players.find(p => p.sessionId === sessionId);
      if (returning) {
        return resumePlayer(socket, roomId, room, returning);
      }

      // Only genuine newcomers are turned away from a match in progress.
      if (room.state !== 'LOBBY') {
        return socket.emit('error', 'Game has already started.');
      }

      room.players.push({ id: socket.id, sessionId, name: playerName, score: 0, streak: 0, connected: true });
      socket.join(roomId);
      // The host chose the topic and the clock; tell the joiner both.
      socket.emit('join_success', roomMeta(roomId, room));
      io.to(roomId).emit('system_message', {
        id: Math.random().toString(36).slice(2, 9),
        text: `👋 ${playerName} joined the room.`
      });

      io.to(roomId).emit('room_update', { players: room.players });
    });

    // Rejoin Room
    socket.on('rejoin_room', ({ roomId, sessionId }) => {
      const room = rooms[roomId];
      if (!room) return socket.emit('error', 'Room not found or expired.');

      const player = room.players.find(p => p.sessionId === sessionId);
      if (!player) return socket.emit('error', 'Session not found in room.');

      resumePlayer(socket, roomId, room, player);
    });

    // Start Game
    socket.on('start_game', async ({ roomId }) => {
      const room = rooms[roomId];
      if (!room || room.state !== 'LOBBY') return;

      room.questions = await loadQuestions(room.topic, room.questionCount);
      // The room may have emptied while the questions were being fetched.
      if (!rooms[roomId] || rooms[roomId].state !== 'LOBBY') return;

      room.state = 'PLAYING';
      room.currentQuestionIndex = 0;
      room.answeredCount = 0;
      room.players.forEach((p) => { p.score = 0; p.streak = 0; p.hasAnswered = false; });

      io.to(roomId).emit('game_started', {
        topic: room.topic,
        topicTitle: room.topicTitle,
        totalQuestions: room.questions.length,
        secondsPerQuestion: room.secondsPerQuestion
      });
      broadcastSystem(roomId, say('gameStart'));
      startRound(roomId);
    });

    // Submit Answer
    socket.on('submit_answer', ({ roomId, selectedOption }) => {
      const room = rooms[roomId];
      if (!room || room.state !== 'PLAYING') return;

      const currentQ = room.questions[room.currentQuestionIndex];
      const player = room.players.find(p => p.id === socket.id);

      if (!player || !currentQ) return;

      // Ensure player hasn't answered yet for this round (simple implementation)
      if (player.hasAnswered) return;
      player.hasAnswered = true;
      room.answeredCount++;

      // Check correctness
      const isCorrect = (selectedOption === currentQ.ans);
      player.roundCorrect = isCorrect;
      if (isCorrect) {
        const firstCorrect = !room.roundHadCorrect;
        room.roundHadCorrect = true;
        player.streak = (player.streak || 0) + 1;
        // A speed bonus rewards answering early, scaled to the room's clock.
        player.score += 10 + (firstCorrect ? 5 : 0);
        if (firstCorrect) room.roundWinner = player.name;
        if (player.streak >= 3) {
          broadcastSystem(roomId, say('streak', { name: player.name, n: player.streak }));
        }
      } else {
        player.streak = 0;
      }

      socket.emit('answer_result', {
        isCorrect,
        correctAns: currentQ.ans,
        explanation: currentQ.explanation || null
      });
      // Let the opponent know a lock-in happened without revealing the answer.
      socket.to(roomId).emit('opponent_answered', { name: player.name });
      io.to(roomId).emit('room_update', { players: room.players });

      // Everyone has answered — reveal now instead of waiting out the clock.
      if (room.answeredCount >= room.players.filter(p => p.connected).length) {
        scheduleRoundEnd(roomId, 400);
      }
    });

    // Rematch — same room, same settings, fresh scores.
    socket.on('rematch', ({ roomId }) => {
      const room = rooms[roomId];
      if (!room || room.state !== 'FINISHED') return;
      clearTimeout(room.roundTimer);
      room.state = 'LOBBY';
      room.currentQuestionIndex = 0;
      room.answeredCount = 0;
      room.questions = [];
      room.players.forEach((p) => {
        p.score = 0; p.streak = 0; p.hasAnswered = false; p.roundCorrect = false;
      });
      io.to(roomId).emit('rematch_ready', roomMeta(roomId, room));
      broadcastSystem(roomId, '🔁 Rematch! Same room, clean slate.');
    });

    // Let the host adjust the clock while everyone is still in the lobby.
    socket.on('update_settings', ({ roomId, secondsPerQuestion, questionCount }) => {
      const room = rooms[roomId];
      if (!room || room.state !== 'LOBBY') return;
      const player = room.players.find((p) => p.id === socket.id);
      if (!player || player.sessionId !== room.hostSessionId) return;

      if (secondsPerQuestion !== undefined) room.secondsPerQuestion = clampSeconds(secondsPerQuestion);
      if (questionCount !== undefined) {
        room.questionCount = Math.max(3, Math.min(25, parseInt(questionCount, 10) || QUESTIONS_PER_MATCH));
      }
      io.to(roomId).emit('settings_updated', roomMeta(roomId, room));
      broadcastSystem(roomId, `⏱️ Clock set to ${room.secondsPerQuestion}s per question.`);
    });

    // Chat Message
    socket.on('send_chat', ({ roomId, message, senderName }) => {
      io.to(roomId).emit('receive_chat', {
        id: Math.random().toString(36).substring(7),
        senderName,
        message,
        timestamp: new Date().toISOString()
      });
    });

    // Emote Reaction
    socket.on('send_emote', ({ roomId, emoji, senderId }) => {
      io.to(roomId).emit('receive_emote', {
        id: Math.random().toString(36).substring(7),
        emoji,
        senderId
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
      // Handle graceful disconnect
      for (const roomId in rooms) {
        const room = rooms[roomId];
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
          player.connected = false;
          io.to(roomId).emit('room_update', { players: room.players });

          // 30s grace period before permanent removal
          room.disconnectTimeouts = room.disconnectTimeouts || {};
          room.disconnectTimeouts[player.sessionId] = setTimeout(() => {
            const playerIndex = room.players.findIndex(p => p.sessionId === player.sessionId);
            if (playerIndex !== -1) {
              room.players.splice(playerIndex, 1);
              if (room.players.length === 0) {
                delete rooms[roomId]; // Cleanup empty room
              } else {
                io.to(roomId).emit('room_update', { players: room.players });
              }
            }
          }, 30000);
        }
      }
    });
  });

  function roomMeta(roomId, room) {
    return {
      roomId,
      players: room.players,
      topic: room.topic,
      topicTitle: room.topicTitle,
      secondsPerQuestion: room.secondsPerQuestion,
      questionCount: room.questionCount,
      hostSessionId: room.hostSessionId
    };
  }

  /**
   * Put a player we already know back into a room on a new socket.
   *
   * Shared by rejoin_room and by join_room, because the client cannot always
   * tell which it should send: a phone that reopened the invite link in a
   * fresh tab has no stored session and will say "join", while the same phone
   * recovering an existing tab will say "rejoin". Both mean the same thing.
   */
  function resumePlayer(socket, roomId, room, player) {
    // Cancel the 30s eviction armed when the old socket dropped.
    if (room.disconnectTimeouts?.[player.sessionId]) {
      clearTimeout(room.disconnectTimeouts[player.sessionId]);
      delete room.disconnectTimeouts[player.sessionId];
    }

    player.id = socket.id;
    player.connected = true;
    socket.join(roomId);

    // Sync the full state back to the rejoining client.
    const current = room.questions[room.currentQuestionIndex];
    socket.emit('rejoin_success', {
      ...roomMeta(roomId, room),
      state: room.state,
      currentQuestionIndex: room.currentQuestionIndex,
      questionData: room.state === 'PLAYING' && current ? {
        question: current.q,
        options: current.options,
        questionNumber: room.currentQuestionIndex + 1,
        totalQuestions: room.questions.length,
        secondsPerQuestion: room.secondsPerQuestion
      } : null
    });

    // Let others know they reconnected.
    io.to(roomId).emit('room_update', { players: room.players });
  }

  function broadcastSystem(roomId, text) {
    io.to(roomId).emit('system_message', {
      id: Math.random().toString(36).slice(2, 9),
      text
    });
  }

  function sendQuestion(roomId, room) {
    const q = room.questions[room.currentQuestionIndex];
    if (!q) return;
    // The answer index is deliberately not broadcast.
    io.to(roomId).emit('new_question', {
      question: q.q,
      options: q.options,
      questionNumber: room.currentQuestionIndex + 1,
      totalQuestions: room.questions.length,
      secondsPerQuestion: room.secondsPerQuestion
    });
  }

  /**
   * The server owns the clock. A client that stalls or disconnects can no
   * longer hang the room, and every player's timer means the same thing.
   */
  function startRound(roomId) {
    const room = rooms[roomId];
    if (!room) return;
    room.roundToken = (room.roundToken || 0) + 1;
    room.answeredCount = 0;
    room.roundHadCorrect = false;
    room.roundWinner = null;
    room.players.forEach((p) => { p.hasAnswered = false; p.roundCorrect = false; });

    sendQuestion(roomId, room);
    // One second of slack covers the round trip from a client that answers
    // right on the buzzer.
    scheduleRoundEnd(roomId, room.secondsPerQuestion * 1000 + 1000);
  }

  function scheduleRoundEnd(roomId, delayMs) {
    const room = rooms[roomId];
    if (!room) return;
    clearTimeout(room.roundTimer);
    const token = room.roundToken;
    room.roundTimer = setTimeout(() => endRound(roomId, token), delayMs);
  }

  function endRound(roomId, token) {
    const room = rooms[roomId];
    // A stale timer from a round that already ended must do nothing.
    if (!room || room.state !== 'PLAYING' || room.roundToken !== token) return;

    const q = room.questions[room.currentQuestionIndex];
    // Counted from this round's flag: `streak` survives across rounds and would
    // credit a player who sat this one out.
    const answeredCorrectly = room.players.filter((p) => p.roundCorrect).length;

    io.to(roomId).emit('round_over', {
      correctAns: q ? q.ans : null,
      explanation: q ? q.explanation : null,
      players: room.players
    });

    if (!room.roundHadCorrect) {
      broadcastSystem(roomId, say(room.answeredCount === 0 ? 'timeout' : 'nobodyCorrect'));
    } else if (answeredCorrectly > 1) {
      broadcastSystem(roomId, say('bothCorrect'));
    } else if (room.roundWinner) {
      broadcastSystem(roomId, say('firstCorrect', { name: room.roundWinner }));
    }

    // Freeze the round so a late answer cannot score.
    room.roundToken++;
    setTimeout(() => {
      const r = rooms[roomId];
      if (!r || r.state !== 'PLAYING') return;
      r.currentQuestionIndex++;
      if (r.currentQuestionIndex >= r.questions.length) {
        finishGame(roomId);
      } else {
        startRound(roomId);
      }
    }, REVEAL_MS);
  }

  function finishGame(roomId) {
    const room = rooms[roomId];
    if (!room) return;
    clearTimeout(room.roundTimer);
    room.state = 'FINISHED';

    const ranked = [...room.players].sort((a, b) => b.score - a.score);
    if (ranked.length > 1 && ranked[0].score === ranked[1].score) {
      broadcastSystem(roomId, say('draw'));
    } else if (ranked.length) {
      broadcastSystem(roomId, say('victory', { name: ranked[0].name }));
    }
    io.to(roomId).emit('game_finished', { players: room.players });
  }

  console.log('[Socket] Grammar Battle Server Initialized');

  // Returned so other feature handlers (friend chat, calls) can attach to the
  // same Socket.IO server rather than opening a second one.
  return io;
}

module.exports = initGameSocket;
