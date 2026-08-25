import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { connectSocket } from '../services/socket';
import { Send, MessageSquare, X, ArrowLeft, Copy, Check, Link2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BattleTopicPicker from '../components/BattleTopicPicker';
import { useBurst } from '../components/reactions/ReactionBurstLayer';
import { haptic } from '../components/reactions/reactionKit';

/** Clock presets, in seconds. The server clamps anything outside 5–60. */
const TIMER_PRESETS = [5, 10, 15, 20, 30, 45, 60];
const ROUND_PRESETS = [5, 10, 15, 20];

/** Two rows: the competitive reactions, then the warm ones. */
const EMOTE_GROUPS = [
  ['😂', '🔥', '😎', '😱', '🤯', '👏', '💪', '🐐', '🤝', '😭', '🙈', '⚡', '🎉', '🤔', '💀', '🧠'],
  ['❤️', '😍', '🥰', '😘', '💖', '💕', '🌹', '💐', '💝', '😻', '🫶', '✨']
];

/** One tap sends a whole sentence — banter without breaking your typing rhythm. */
const QUICK_PHRASES = [
  'Good luck! 🍀',
  'Nice one! 👏',
  'Too easy 😎',
  'Ouch! 😵',
  'Hurry up! ⏰',
  'Rematch? 🔁',
  'சூப்பர்! 🔥',
  'வாழ்த்துக்கள்! 🎉',
  'You are brilliant! 💖',
  'அருமை! 😍'
];

export default function MultiplayerBattle() {
  const { roomId: roomIdParam } = useParams();
  const navigate = useNavigate();
  const { burst } = useBurst();
  const burstRef = useRef(burst);
  useEffect(() => { burstRef.current = burst; }, [burst]);
  const { profile } = useAuth();

  const [socket, setSocket] = useState(null);
  // Whether that socket is actually open. Create and Join stay disabled until
  // it is, so a click cannot disappear into a buffered emit.
  const [connected, setConnected] = useState(false);
  // Set while a create_room is in flight, so the button shows progress and a
  // server that never answers surfaces an error instead of hanging.
  const [creating, setCreating] = useState(false);
  const [gameState, setGameState] = useState(roomIdParam ? 'CONNECTING' : 'SETUP');
  const [roomId, setRoomId] = useState(roomIdParam || '');
  const [joinCode, setJoinCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [copied, setCopied] = useState(false);
  const [roomError, setRoomError] = useState(null);

  // Room settings — chosen before the room exists, then owned by the server.
  const [topic, setTopic] = useState(null);
  const [seconds, setSeconds] = useState(10);
  const [questionCount, setQuestionCount] = useState(10);
  const [roomTopicTitle, setRoomTopicTitle] = useState(null);
  const [hostSessionId, setHostSessionId] = useState(null);

  const [sessionId] = useState(() => {
    let sid = sessionStorage.getItem('grammar_battle_sid');
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('grammar_battle_sid', sid);
    }
    return sid;
  });

  // Game data
  const [questionData, setQuestionData] = useState(null);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [opponentLockedIn, setOpponentLockedIn] = useState(false);

  // Social
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState(null);
  const chatEndRef = useRef(null);
  const joinedRef = useRef(null);

  const playerName = profile?.full_name || 'Player';
  const isHost = hostSessionId ? hostSessionId === sessionId : true;
  const inviteUrl = roomId ? `${window.location.origin}/battle/room/${roomId}` : '';

  /* ----------------------------------------------------------- socket ---- */
  useEffect(() => {
    const newSocket = connectSocket();
    setSocket(newSocket);

    // Attach through this helper so cleanup can detach exactly what this screen
    // added. The old cleanup called socket.off(event) with no handler, which
    // removes EVERY listener for that event — including the 'connect' handler
    // CallProvider relies on for presence and incoming calls.
    const bound = [];
    const on = (event, handler) => {
      bound.push([event, handler]);
      newSocket.on(event, handler);
    };

    const applyMeta = (data) => {
      setRoomId(data.roomId);
      setPlayers(data.players || []);
      setRoomTopicTitle(data.topicTitle || null);
      if (data.secondsPerQuestion) setSeconds(data.secondsPerQuestion);
      if (data.questionCount) setQuestionCount(data.questionCount);
      if (data.hostSessionId) setHostSessionId(data.hostSessionId);
      sessionStorage.setItem('activeRoomId', data.roomId);
    };

    on('room_created', (data) => {
      setCreating(false);
      applyMeta(data);
      setGameState('LOBBY');
      joinedRef.current = data.roomId;
      // The room now has an address — put it in the URL so it can be shared.
      navigate(`/battle/room/${data.roomId}`, { replace: true });
    });

    on('join_success', (data) => {
      applyMeta(data);
      setGameState('LOBBY');
    });

    on('rejoin_success', (data) => {
      applyMeta(data);
      setGameState(data.state);
      if (data.questionData) {
        setQuestionData(data.questionData);
        setTimeLeft(data.questionData.secondsPerQuestion || 10);
      }
    });

    on('settings_updated', (data) => {
      applyMeta(data);
    });

    on('rematch_ready', (data) => {
      applyMeta(data);
      setGameState('LOBBY');
      setQuestionData(null);
      setSelectedOpt(null);
      setAnswerResult(null);
    });

    on('connect', () => {
      setConnected(true);
      setRoomError(null);
      const savedRoomId = sessionStorage.getItem('activeRoomId');
      if (savedRoomId) newSocket.emit('rejoin_room', { roomId: savedRoomId, sessionId });
    });

    on('disconnect', () => setConnected(false));

    // Without this the Create button just does nothing when the server is
    // unreachable, which is exactly how this bug presented.
    on('connect_error', () => {
      setConnected(false);
      setCreating(false);
      setRoomError('Cannot reach the game server. Check your connection and try again.');
    });

    if (newSocket.connected) setConnected(true);

    on('room_update', (data) => setPlayers(data.players));

    on('error', (msg) => {
      setCreating(false);
      setRoomError(typeof msg === 'string' ? msg : 'Something went wrong.');
      setGameState('SETUP');
      setRoomId('');
      sessionStorage.removeItem('activeRoomId');
      joinedRef.current = null;
      // A dead invite link should not stay in the address bar.
      navigate('/battle/room', { replace: true });
    });

    on('game_started', (data) => {
      setGameState('COUNTDOWN');
      setChatMessages((prev) => prev.slice(-30));
      setTimeout(() => {
        setGameState('PLAYING');
        setTimeLeft(data?.secondsPerQuestion || 10);
      }, 2000);
    });

    on('new_question', (data) => {
      setQuestionData(data);
      setSelectedOpt(null);
      setAnswerResult(null);
      setOpponentLockedIn(false);
      setTimeLeft(data.secondsPerQuestion || 10);
    });

    on('answer_result', (data) => setAnswerResult(data));

    // Sent to everyone at the end of a round, including anyone who ran out of
    // time, so the correct answer is always revealed.
    on('round_over', (data) => {
      setAnswerResult((prev) => prev || { isCorrect: false, correctAns: data.correctAns, explanation: data.explanation });
      if (data.players) setPlayers(data.players);
    });

    on('opponent_answered', ({ name }) => {
      setOpponentLockedIn(true);
      setToast({ id: Math.random(), text: `🔒 ${name} locked in!` });
    });

    on('game_finished', (data) => {
      setPlayers(data.players);
      setGameState('FINISHED');
    });

    on('receive_chat', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    on('system_message', (msg) => {
      setChatMessages((prev) => [...prev, { ...msg, system: true }]);
      setToast({ id: msg.id, text: msg.text });
    });

    on('receive_emote', (data) => {
      // Everyone in the room sees this, including the sender — who already
      // burst it locally on tap, so theirs is skipped to avoid a double volley.
      if (data.senderId === newSocket.id) return;
      burstRef.current(data.emoji, {
        count: 9,
        originX: window.innerWidth * (0.2 + Math.random() * 0.6),
        originY: window.innerHeight * 0.68,
        buzz: false
      });
    });

    return () => {
      // Detach only this screen's handlers, by reference.
      bound.forEach(([event, handler]) => newSocket.off(event, handler));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------------------------------- join the room in the URL ---- */
  useEffect(() => {
    if (!socket || !roomIdParam) return;
    if (joinedRef.current === roomIdParam) return;
    joinedRef.current = roomIdParam;

    const saved = sessionStorage.getItem('activeRoomId');
    if (saved === roomIdParam) {
      socket.emit('rejoin_room', { roomId: roomIdParam, sessionId });
    } else {
      socket.emit('join_room', { roomId: roomIdParam, playerName, sessionId });
    }
  }, [socket, roomIdParam, sessionId, playerName]);

  /* ------------------------------------------------------------ timers --- */
  useEffect(() => {
    if (gameState !== 'PLAYING' || selectedOpt !== null || answerResult) return;
    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
    handleAnswer(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, timeLeft, selectedOpt, answerResult]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (chatOpen) {
      setUnread(0);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (chatMessages.length) {
      setUnread((n) => n + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages, chatOpen]);

  /* ----------------------------------------------------------- actions --- */
  const handleCreateRoom = () => {
    if (!socket || !socket.connected) {
      setRoomError('Still connecting to the game server — try again in a moment.');
      return;
    }
    setRoomError(null);
    setCreating(true);
    setTimeout(() => {
      setCreating((inFlight) => {
        if (inFlight) setRoomError('The server did not answer. Please try again.');
        return false;
      });
    }, 8000);
    socket.emit('create_room', {
      playerName,
      sessionId,
      topic: topic?.id || 'mixed',
      topicTitle: topic?.title || 'Mixed Challenge',
      secondsPerQuestion: seconds,
      questionCount
    });
  };

  const handleJoinByCode = () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) return setRoomError('Enter a room code first.');
    if (!socket || !socket.connected) {
      setRoomError('Still connecting to the game server — try again in a moment.');
      return;
    }
    setRoomError(null);
    navigate(`/battle/room/${code}`);
  };

  const handleStartMatch = () => socket.emit('start_game', { roomId });
  const handleRematch = () => socket.emit('rematch', { roomId });

  const handleChangeSeconds = (value) => {
    setSeconds(value);
    if (roomId && gameState === 'LOBBY') {
      socket.emit('update_settings', { roomId, secondsPerQuestion: value });
    }
  };

  const handleAnswer = useCallback((idx) => {
    if (selectedOpt !== null || answerResult) return;
    setSelectedOpt(idx);
    socket.emit('submit_answer', { roomId, selectedOption: idx });
  }, [selectedOpt, answerResult, socket, roomId]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !roomId) return;
    socket.emit('send_chat', { roomId, message: chatInput, senderName: playerName });
    setChatInput('');
  };

  const sendPhrase = (text) => {
    if (!roomId) return;
    socket.emit('send_chat', { roomId, message: text, senderName: playerName });
  };

  const handleSendEmote = (emoji, sourceEl) => {
    if (!roomId) return;
    haptic();

    // Burst locally from the button that was tapped, so the reaction feels
    // instant instead of waiting for the server round trip.
    let originX;
    let originY;
    if (sourceEl?.getBoundingClientRect) {
      const r = sourceEl.getBoundingClientRect();
      originX = r.left + r.width / 2;
      originY = r.top + r.height / 2;
    }
    burst(emoji, { count: 10, originX, originY });

    socket.emit('send_emote', { roomId, emoji, senderId: socket.id });
  };

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setRoomError('Could not copy — select the link and copy it manually.');
    }
  };

  const leaveRoom = () => {
    sessionStorage.removeItem('activeRoomId');
    joinedRef.current = null;
    navigate('/battle/room');
    setGameState('SETUP');
    setRoomId('');
    setPlayers([]);
    setChatMessages([]);
  };

  const me = players.find((p) => p.id === socket?.id) || { name: playerName, score: 0, streak: 0 };
  const opponent = players.find((p) => p.id !== socket?.id) || { name: 'Waiting…', score: 0, streak: 0 };

  /* ------------------------------------------------------------- views --- */

  // Built as plain elements rather than nested components: a component defined
  // inside the render is a new type on every pass, so React would remount it —
  // and the one-second timer tick would restart every emote animation.
  const emoteBar = (
    <div className="space-y-1">
      {EMOTE_GROUPS.map((group, gi) => (
        // One scrolling line per group rather than a wrapping grid: wrapped, the
        // 28 emoji took ~180px of vertical space in the middle of a match.
        <div key={gi} className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto hide-scrollbar sm:flex-wrap sm:justify-center px-0.5">
          {group.map((emoji) => (
            <button
              key={emoji}
              onClick={(e) => handleSendEmote(emoji, e.currentTarget)}
              className="w-9 h-9 xs:w-10 xs:h-10 shrink-0 text-xl xs:text-2xl leading-none rounded-xl flex items-center justify-center hover:bg-surface-variant hover:scale-125 active:scale-90 transition-transform"
              title="Send reaction"
              aria-label={`Send ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-nav min-h-[80vh] flex flex-col justify-center animate-fade-in relative">
      {/* Banter toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-full bg-on-surface text-surface text-sm font-bold shadow-xl animate-pop-in">
          {toast.text}
        </div>
      )}

      {/* ---------------------------------------------------- 0. SETUP --- */}
      {gameState === 'SETUP' && (
        <div className="animate-fade-in">
          <button
            onClick={() => navigate('/battle')}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full text-on-surface hover:bg-surface-variant transition-all font-bold text-sm mb-5"
          >
            <ArrowLeft size={16} /> Back to Modes
          </button>

          <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-xl flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">Create a Battle Room</h1>
              <p className="text-sm text-on-surface-variant font-medium mt-1">
                Pick a topic, set the clock, then share the link with a friend.
              </p>
              <p className="text-xs text-on-surface-variant font-tamil mt-1">
                தலைப்பு மற்றும் நேரத்தைத் தேர்ந்தெடுத்து அறையை உருவாக்கவும்.
              </p>
            </div>

            {roomError && (
              <div className="px-4 py-2.5 rounded-2xl bg-error-container/40 border border-error/30 text-error text-xs font-bold text-center animate-shake">
                {roomError}
              </div>
            )}

            {/* Topic */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                1. Topic
              </span>
              <div className="max-h-64 overflow-y-auto pr-1">
                <BattleTopicPicker value={topic} onChange={setTopic} compact />
              </div>
            </div>

            {/* Timer */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                2. Seconds per question
              </span>
              <div className="flex flex-wrap gap-2">
                {TIMER_PRESETS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeconds(s)}
                    className={`px-4 py-2 rounded-xl font-extrabold text-sm border-2 transition-all ${
                      seconds === s
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                        : 'bg-surface border-surface-variant text-on-surface hover:border-primary'
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={1}
                  value={seconds}
                  onChange={(e) => setSeconds(Number(e.target.value))}
                  className="flex-1 min-w-0 accent-primary"
                />
                <span className="w-14 text-center text-sm font-extrabold text-primary">{seconds}s</span>
              </div>
            </div>

            {/* Rounds */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                3. Number of questions
              </span>
              <div className="flex flex-wrap gap-2">
                {ROUND_PRESETS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-4 py-2 rounded-xl font-extrabold text-sm border-2 transition-all ${
                      questionCount === n
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                        : 'bg-surface border-surface-variant text-on-surface hover:border-primary'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={!connected || creating}
              className="w-full px-3 py-4 rounded-2xl bg-primary text-white font-extrabold text-sm shadow-lg shadow-primary/25 hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50 break-words"
            >
              {creating
                ? 'Creating room…'
                : !connected
                  ? 'Connecting to the game server…'
                  : `Create Room · ${topic?.title || 'Mixed Challenge'} · ${seconds}s · ${questionCount} Qs`}
            </button>

            {/* Say plainly when the socket is not up, instead of leaving a
                button that silently does nothing. */}
            {!connected && (
              <p className="text-[11px] font-bold text-on-surface-variant text-center flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                Connecting to the game server…
              </p>
            )}

            <div className="flex items-center gap-2 text-on-surface/50 text-xs font-bold uppercase">
              <span className="flex-1 min-w-0 border-b border-surface-variant" />
              OR JOIN
              <span className="flex-1 min-w-0 border-b border-surface-variant" />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Room Code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoinByCode()}
                className="flex-1 min-w-0 px-4 py-3 rounded-2xl bg-surface-container border border-surface-variant focus:border-primary uppercase font-bold tracking-widest text-center outline-none"
                maxLength={4}
              />
              <button
                onClick={handleJoinByCode}
                disabled={!connected}
                className="px-6 py-3 bg-surface-container-highest text-on-surface font-bold rounded-2xl hover:bg-surface-variant transition-all active:scale-95"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------- 0b. CONNECTING --- */}
      {gameState === 'CONNECTING' && (
        <div className="p-12 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-xl text-center">
          <span className="material-symbols-outlined text-[42px] text-primary animate-spin">progress_activity</span>
          <p className="text-sm font-bold text-on-surface-variant mt-3">Joining room {roomIdParam}…</p>
        </div>
      )}

      {/* ---------------------------------------------------- 1. LOBBY --- */}
      {gameState === 'LOBBY' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-xl text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 shrink-0 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <span className="material-symbols-outlined text-[44px]">sports_kabaddi</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
              Room: <span className="text-primary tracking-widest">{roomId}</span>
            </h1>
            <p className="text-sm text-on-surface-variant font-medium mt-1 font-tamil">
              நண்பரை அழைத்து நேரடி இலக்கண சவாலைத் தொடங்குங்கள்!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {roomTopicTitle && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-bold text-primary">
                <span className="material-symbols-outlined text-[16px]">category</span>
                {roomTopicTitle}
              </span>
            )}
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-error/10 border border-error/30 text-xs font-bold text-error">
              <span className="material-symbols-outlined text-[16px]">timer</span>
              {seconds}s per question
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-xs font-bold text-secondary">
              <span className="material-symbols-outlined text-[16px]">tag</span>
              {questionCount} questions
            </span>
          </div>

          {/* Invite link */}
          <div className="w-full max-w-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1 mb-1.5">
              <Link2 size={12} /> Invite link
            </span>
            <div className="flex gap-2">
              <input
                readOnly
                value={inviteUrl}
                onFocus={(e) => e.target.select()}
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-surface-container border border-surface-variant text-xs font-medium outline-none"
              />
              <button
                onClick={copyInvite}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                  copied ? 'bg-secondary text-white' : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Host can retune the clock without recreating the room */}
          {isHost && (
            <div className="w-full max-w-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                Adjust the clock
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {TIMER_PRESETS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleChangeSeconds(s)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${
                      seconds === s
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface border-surface-variant text-on-surface hover:border-primary'
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Players */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 p-4 rounded-2xl bg-surface-container w-full max-w-sm">
            <div className="flex flex-col items-center min-w-0">
              <div className="w-12 h-12 shrink-0 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                {me.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold mt-1 truncate max-w-[8rem]">{me.name}</span>
            </div>

            <span className="text-lg font-extrabold text-error">VS</span>

            <div className="flex flex-col items-center min-w-0">
              <div className={`w-12 h-12 shrink-0 rounded-full font-bold flex items-center justify-center ${players.length > 1 ? 'bg-secondary text-white' : 'bg-surface-variant text-on-surface-variant animate-pulse'}`}>
                {players.length > 1 ? opponent.name.charAt(0).toUpperCase() : '?'}
              </div>
              <span className="text-xs font-bold mt-1 truncate max-w-[8rem]">{players.length > 1 ? opponent.name : 'Waiting…'}</span>
            </div>
          </div>

          {emoteBar}

          <button
            onClick={handleStartMatch}
            disabled={players.length < 2}
            className="w-full max-w-sm py-4 rounded-2xl bg-primary text-white font-extrabold text-sm shadow-lg shadow-primary/25 hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all"
          >
            {players.length < 2 ? 'Waiting for friend…' : 'Start Duel!'}
          </button>

          <button onClick={leaveRoom} className="text-xs font-bold text-on-surface-variant hover:text-error transition-colors">
            Leave room
          </button>
        </div>
      )}

      {/* ------------------------------------------------ 2. COUNTDOWN --- */}
      {gameState === 'COUNTDOWN' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-xl text-center flex flex-col items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Match Starting</span>
          <h2 className="text-5xl sm:text-6xl font-extrabold text-error font-display animate-ping">READY!</h2>
        </div>
      )}

      {/* -------------------------------------------------- 3. PLAYING --- */}
      {gameState === 'PLAYING' && questionData && (
        <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-xl flex flex-col gap-5">
          {/* Scores + clock */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-surface-container gap-2 sm:gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 shrink-0 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                {me.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase block text-on-surface-variant truncate">You</span>
                <span key={me.score} className="text-sm font-extrabold text-primary font-display inline-block animate-score-pop">
                  {me.score} pts
                </span>
                {me.streak >= 2 && <span className="ml-1 text-[10px] font-bold text-error">🔥{me.streak}</span>}
              </div>
            </div>

            <div className={`px-2.5 sm:px-3 py-1 shrink-0 rounded-full font-extrabold text-xs flex items-center gap-1 shadow-sm ${
              timeLeft <= 3 ? 'bg-error text-white animate-pulse' : 'bg-surface-container-highest text-on-surface'
            }`}>
              <span className="material-symbols-outlined text-[14px]">timer</span>
              {timeLeft}s
            </div>

            <div className="flex items-center gap-2 text-right min-w-0 flex-1 justify-end">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase block text-on-surface-variant truncate">
                  {opponent.name}
                  {opponentLockedIn && <span className="ml-1 text-secondary">🔒</span>}
                </span>
                <span key={opponent.score} className="text-sm font-extrabold text-error font-display inline-block animate-score-pop">
                  {opponent.score} pts
                </span>
                {opponent.streak >= 2 && <span className="ml-1 text-[10px] font-bold text-error">🔥{opponent.streak}</span>}
              </div>
              <div className="w-8 h-8 shrink-0 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center">
                {opponent.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center py-2">
            <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">
              Round {questionData.questionNumber} of {questionData.totalQuestions}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-on-surface font-display break-words">{questionData.question}</h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {questionData.options.map((opt, idx) => {
              let style = 'bg-surface-container-high text-on-surface hover:bg-surface-variant';
              if (answerResult) {
                if (idx === answerResult.correctAns) {
                  style = 'bg-secondary-container text-secondary font-bold border-2 border-secondary';
                } else if (selectedOpt === idx) {
                  style = 'bg-error-container text-error font-bold border-2 border-error animate-shake';
                }
              } else if (selectedOpt === idx) {
                style = 'bg-primary text-white shadow-primary/30 shadow-lg scale-[1.02]';
              }
              return (
                <button
                  key={idx}
                  disabled={selectedOpt !== null}
                  onClick={() => handleAnswer(idx)}
                  className={`p-3.5 sm:p-4 rounded-2xl font-semibold text-sm text-left transition-all active:scale-[0.98] break-words ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {answerResult?.explanation && (
            <p className="text-xs text-on-surface-variant font-medium text-center px-2 animate-fade-in">
              💡 {answerResult.explanation}
            </p>
          )}

          {/* Reactions mid-match */}
          <div className="pt-1 border-t border-surface-variant/40">
            {emoteBar}
          </div>
        </div>
      )}

      {/* ------------------------------------------------- 4. FINISHED --- */}
      {gameState === 'FINISHED' && (
        <div className="p-5 sm:p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-2xl text-center flex flex-col items-center gap-5 animate-slide-in">
          <div className="w-20 h-20 shrink-0 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary shadow-inner">
            <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {me.score >= opponent.score ? 'emoji_events' : 'sentiment_satisfied'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
            {me.score > opponent.score ? 'VICTORY! 🎉' : me.score === opponent.score ? "IT'S A TIE! 🤝" : 'DEFEAT!'}
          </h2>

          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            <div className="p-4 rounded-2xl bg-surface-container text-center">
              <span className="text-xs font-bold text-on-surface-variant uppercase">Your Score</span>
              <p className="text-2xl font-bold text-primary font-display">{me.score}</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container text-center">
              <span className="text-xs font-bold text-on-surface-variant uppercase">{opponent.name}</span>
              <p className="text-2xl font-bold text-error font-display">{opponent.score}</p>
            </div>
          </div>

          {emoteBar}

          <div className="flex flex-col gap-2 w-full max-w-sm">
            <button
              onClick={handleRematch}
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary-container transition-all active:scale-95"
            >
              🔁 Rematch (same room)
            </button>
            <button
              onClick={leaveRoom}
              className="w-full py-3.5 rounded-2xl bg-surface-container-highest text-on-surface font-bold text-xs hover:bg-surface-variant transition-all active:scale-95"
            >
              New Room
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------- CHAT WIDGET --- */}
      {roomId && gameState !== 'SETUP' && (
        <>
          <div className={`fixed right-3 md:right-8 w-[calc(100vw-1.5rem)] max-w-[20rem] bg-surface border border-surface-variant/60 shadow-2xl rounded-2xl overflow-hidden z-50 transition-all duration-300 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] ${chatOpen ? 'h-[26rem] max-h-[calc(100dvh-12rem)] opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-10 pointer-events-none'}`}>
            <div className="flex flex-col h-full">
              <div className="p-3 bg-primary text-white flex justify-between items-center gap-3">
                <span className="font-bold text-sm flex items-center gap-2"><MessageSquare size={16} /> Room Chat</span>
                <button onClick={() => setChatOpen(false)}><X size={16} /></button>
              </div>

              <div className="flex-1 min-w-0 overflow-y-auto p-3 space-y-2 bg-surface-container-lowest">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-center text-on-surface/40 mt-4">Say hello! 👋</p>
                ) : (
                  chatMessages.map((msg) => (
                    msg.system ? (
                      <div key={msg.id} className="text-center">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-surface-container-high text-[10px] font-bold text-on-surface-variant">
                          {msg.text}
                        </span>
                      </div>
                    ) : (
                      <div key={msg.id} className={`flex flex-col ${msg.senderName === playerName ? 'items-end' : 'items-start'}`}>
                        <span className="text-[9px] font-bold text-on-surface/50 mb-0.5 px-1">{msg.senderName}</span>
                        <div className={`px-3 py-1.5 rounded-xl max-w-[85%] text-xs font-medium shadow-sm ${msg.senderName === playerName ? 'bg-primary text-white rounded-br-none' : 'bg-surface-container-high text-on-surface rounded-bl-none'}`}>
                          {msg.message}
                        </div>
                      </div>
                    )
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* One-tap banter */}
              <div className="px-2 pt-2 flex gap-1.5 overflow-x-auto bg-surface border-t border-surface-variant/40">
                {QUICK_PHRASES.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendPhrase(p)}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container text-[11px] font-bold text-on-surface hover:bg-primary hover:text-white transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="p-2 bg-surface flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Message…"
                  className="flex-1 min-w-0 bg-surface-container rounded-lg px-3 py-1.5 text-xs outline-none"
                />
                <button type="submit" className="bg-primary text-white p-1.5 rounded-lg"><Send size={14} /></button>
              </form>
            </div>
          </div>

          {!chatOpen && (
            <button
              onClick={() => setChatOpen(true)}
              className="fixed right-3 md:right-8 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] w-12 h-12 shrink-0 bg-primary text-white rounded-full shadow-xl flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-all"
            >
              <MessageSquare size={20} />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
