const jwt = require('jsonwebtoken');
const config = require('../config/env');
const db = require('../config/db');
const chatService = require('../services/chatService');

/**
 * Friend chat and voice calling over Socket.IO.
 *
 * The audio itself never passes through this server. A voice call is plain
 * peer-to-peer WebRTC; all the server does is relay the three kinds of
 * signalling message the two browsers need to find each other (offer, answer,
 * ICE candidate) and remember who is online. That relay is why a call needs a
 * signalling channel at all — the peers cannot exchange those blobs directly
 * until the connection they describe already exists.
 */

/** An unanswered call stops ringing after this long. */
const RING_TIMEOUT_MS = 45000;

/** userId -> Set of socket ids. A user may have several tabs or devices open. */
const online = new Map();

/** callId -> { callId, roomId, callerId, calleeId, state, ringTimer, connectedAt } */
const calls = new Map();

/** userId -> callId, so a second caller can be told the line is busy. */
const busy = new Map();

const roomOf = (userId) => `user:${userId}`;

/**
 * Resolve the user behind a socket.
 *
 * Mirrors the REST layer's posture: a valid JWT wins, and without one we fall
 * back to the first active account the same way `authenticateToken` does, so
 * the app keeps working in its signed-out demo mode. Tighten this to
 * "reject when the token is missing" before exposing the server publicly —
 * as written, an unauthenticated socket is treated as that fallback user.
 */
async function identify(socket) {
  const token = socket.handshake?.auth?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const rows = await db.query('SELECT id, email, status FROM users WHERE id = ?', [decoded.userId]);
      if (rows.length > 0 && rows[0].status === 'active') return rows[0].id;
    } catch (_) {
      // fall through to the demo-mode fallback below
    }
  }

  try {
    const rows = await db.query(
      "SELECT id FROM users WHERE status = 'active' ORDER BY id ASC LIMIT 1"
    );
    return rows[0]?.id || null;
  } catch (_) {
    return null;
  }
}

function markOnline(userId, socketId) {
  if (!online.has(userId)) online.set(userId, new Set());
  online.get(userId).add(socketId);
}

function markOffline(userId, socketId) {
  const set = online.get(userId);
  if (!set) return false;
  set.delete(socketId);
  if (set.size === 0) {
    online.delete(userId);
    return true; // last device gone — the user is genuinely offline now
  }
  return false;
}

const isOnline = (userId) => online.has(Number(userId)) || online.has(String(userId));

/** Write the outcome of a call to the timeline. Never throws into the socket. */
async function logCall(call, status) {
  try {
    const duration = call.connectedAt
      ? Math.max(0, Math.round((Date.now() - call.connectedAt) / 1000))
      : 0;

    await db.execute(
      `INSERT INTO call_logs (call_id, room_id, caller_id, callee_id, call_type, status, duration_seconds, started_at, ended_at)
       VALUES (?, ?, ?, ?, 'voice', ?, ?, ?, ?)`,
      [
        call.callId,
        call.roomId,
        call.callerId,
        call.calleeId,
        status,
        duration,
        new Date(call.startedAt).toISOString(),
        new Date().toISOString()
      ]
    );
  } catch (err) {
    // A duplicate call_id means we already logged this call's outcome.
    if (!/UNIQUE|Duplicate/i.test(err.message)) {
      console.warn('[chatHandler] call log failed:', err.message);
    }
  }
}

function clearCall(call) {
  if (call.ringTimer) clearTimeout(call.ringTimer);
  calls.delete(call.callId);
  if (busy.get(call.callerId) === call.callId) busy.delete(call.callerId);
  if (busy.get(call.calleeId) === call.callId) busy.delete(call.calleeId);
}

function initChatSocket(io) {
  io.on('connection', (socket) => {
    let userId = null;

    /* ------------------------------------------------------ presence --- */

    socket.on('chat:register', async (_payload, ack) => {
      userId = await identify(socket);
      if (!userId) {
        if (typeof ack === 'function') ack({ ok: false, error: 'Could not identify this session.' });
        return;
      }

      socket.join(roomOf(userId));
      markOnline(userId, socket.id);

      // Tell this user's friends they came online, and report back who of
      // theirs is already here.
      try {
        const friends = await db.query(
          `SELECT CASE WHEN user_id = ? THEN friend_id ELSE user_id END AS friend_id
           FROM friendships
           WHERE status = 'accepted' AND (user_id = ? OR friend_id = ?)`,
          [userId, userId, userId]
        );

        const friendIds = friends.map((f) => f.friend_id);
        for (const fid of friendIds) {
          io.to(roomOf(fid)).emit('presence:update', { userId, online: true });
        }

        if (typeof ack === 'function') {
          ack({ ok: true, userId, onlineFriends: friendIds.filter(isOnline) });
        }
      } catch (err) {
        if (typeof ack === 'function') ack({ ok: true, userId, onlineFriends: [] });
      }
    });

    socket.on('presence:check', ({ userIds = [] } = {}, ack) => {
      if (typeof ack === 'function') ack({ online: userIds.filter(isOnline) });
    });

    /* --------------------------------------------------- room + chat --- */

    socket.on('chat:join', async ({ roomId } = {}, ack) => {
      if (!userId || !roomId) return;
      if (!(await chatService.canAccessRoom(userId, roomId))) {
        if (typeof ack === 'function') ack({ ok: false, error: 'You are not a member of this room.' });
        return;
      }
      socket.join(`room:${roomId}`);
      if (typeof ack === 'function') ack({ ok: true });
    });

    socket.on('chat:leave', ({ roomId } = {}) => {
      if (roomId) socket.leave(`room:${roomId}`);
    });

    socket.on('chat:message', async ({ roomId, messageText, checkGrammar = true } = {}, ack) => {
      if (!userId || !roomId || !messageText?.trim()) return;

      try {
        if (!(await chatService.canAccessRoom(userId, roomId))) {
          if (typeof ack === 'function') ack({ ok: false, error: 'You are not a member of this room.' });
          return;
        }

        const message = await chatService.createMessage({ userId, roomId, messageText, checkGrammar });
        io.to(`room:${roomId}`).emit('chat:new-message', message);

        // Nudge the other member even when they have the room closed, so their
        // conversation list can show the unread badge.
        const peer = await chatService.getDirectPeer(roomId, userId);
        if (peer) {
          io.to(roomOf(peer.id)).emit('chat:room-activity', {
            roomId,
            preview: message.message_text.slice(0, 80),
            senderId: userId,
            at: message.created_at
          });
        }

        if (typeof ack === 'function') ack({ ok: true, message });
      } catch (err) {
        console.error('[chatHandler] message failed:', err.message);
        if (typeof ack === 'function') ack({ ok: false, error: 'Could not send that message.' });
      }
    });

    socket.on('chat:react', async ({ roomId, messageId, emoji } = {}, ack) => {
      if (!userId) return;

      try {
        const result = await chatService.toggleReaction({ userId, messageId, emoji, roomId });

        // Broadcast to the room so both sides see the same counts, and include
        // who reacted so each client can tell whether the reaction is theirs.
        io.to(`room:${result.roomId}`).emit('chat:reaction-update', {
          roomId: result.roomId,
          messageId: result.messageId,
          reactions: result.reactions,
          // The client uses these to fire the burst animation for a reaction
          // somebody else just added — but not for one being removed.
          lastEmoji: result.emoji,
          added: result.added,
          byUserId: userId
        });

        if (typeof ack === 'function') ack({ ok: true, ...result });
      } catch (err) {
        if (typeof ack === 'function') ack({ ok: false, error: err.message });
      }
    });

    socket.on('chat:typing', ({ roomId, isTyping } = {}) => {
      if (!userId || !roomId) return;
      socket.to(`room:${roomId}`).emit('chat:typing', { roomId, userId, isTyping: !!isTyping });
    });

    /* ------------------------------------------------ call signalling --- */

    socket.on('call:invite', async ({ roomId, toUserId } = {}, ack) => {
      const fail = (error) => typeof ack === 'function' && ack({ ok: false, error });
      if (!userId) return fail('Not signed in.');
      if (!roomId || !toUserId) return fail('Missing call target.');
      if (Number(toUserId) === Number(userId)) return fail('You cannot call yourself.');

      // Calls are friends-only. This is the check that actually matters: it is
      // enforced here rather than in the UI, so a crafted socket event cannot
      // ring a stranger's phone.
      if (!(await chatService.areFriends(userId, toUserId))) {
        return fail('You can only call people on your friends list.');
      }
      if (!isOnline(toUserId)) return fail('They are offline right now.');
      if (busy.has(Number(toUserId))) return fail('They are already on another call.');
      if (busy.has(Number(userId))) return fail('You are already on a call.');

      const callId = `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const call = {
        callId,
        roomId,
        callerId: Number(userId),
        calleeId: Number(toUserId),
        state: 'ringing',
        startedAt: Date.now(),
        connectedAt: null,
        ringTimer: null
      };

      call.ringTimer = setTimeout(async () => {
        if (calls.get(callId)?.state !== 'ringing') return;
        io.to(roomOf(call.callerId)).emit('call:ended', { callId, reason: 'no-answer' });
        io.to(roomOf(call.calleeId)).emit('call:ended', { callId, reason: 'no-answer' });
        await logCall(call, 'missed');
        clearCall(call);
      }, RING_TIMEOUT_MS);

      calls.set(callId, call);
      busy.set(call.callerId, callId);
      busy.set(call.calleeId, callId);

      const caller = await db.query(
        `SELECT p.full_name, p.avatar_url FROM user_profiles p WHERE p.user_id = ?`,
        [userId]
      );

      io.to(roomOf(toUserId)).emit('call:incoming', {
        callId,
        roomId,
        from: {
          id: Number(userId),
          name: caller[0]?.full_name || 'A friend',
          avatar: caller[0]?.avatar_url || null
        },
        ringTimeoutMs: RING_TIMEOUT_MS
      });

      if (typeof ack === 'function') ack({ ok: true, callId, ringTimeoutMs: RING_TIMEOUT_MS });
    });

    socket.on('call:accept', ({ callId } = {}) => {
      const call = calls.get(callId);
      if (!call || call.state !== 'ringing') return;
      if (Number(userId) !== call.calleeId) return;

      call.state = 'connected';
      call.connectedAt = Date.now();
      if (call.ringTimer) clearTimeout(call.ringTimer);

      // The caller creates the WebRTC offer once the callee has picked up, so
      // no microphone is opened on either side until the call is really live.
      io.to(roomOf(call.callerId)).emit('call:accepted', { callId });
    });

    socket.on('call:reject', async ({ callId, reason = 'declined' } = {}) => {
      const call = calls.get(callId);
      if (!call) return;
      if (Number(userId) !== call.calleeId && Number(userId) !== call.callerId) return;

      io.to(roomOf(call.callerId)).emit('call:ended', { callId, reason });
      io.to(roomOf(call.calleeId)).emit('call:ended', { callId, reason });
      await logCall(call, reason === 'busy' ? 'missed' : 'declined');
      clearCall(call);
    });

    /**
     * Blind relay of SDP offers/answers and ICE candidates to the other party.
     * The server does not parse or store them.
     */
    socket.on('call:signal', ({ callId, data } = {}) => {
      const call = calls.get(callId);
      if (!call || !data) return;

      const me = Number(userId);
      if (me !== call.callerId && me !== call.calleeId) return;

      const peerId = me === call.callerId ? call.calleeId : call.callerId;
      io.to(roomOf(peerId)).emit('call:signal', { callId, data });
    });

    socket.on('call:end', async ({ callId } = {}) => {
      const call = calls.get(callId);
      if (!call) return;

      const me = Number(userId);
      if (me !== call.callerId && me !== call.calleeId) return;

      const wasConnected = call.state === 'connected';
      io.to(roomOf(call.callerId)).emit('call:ended', { callId, reason: 'hangup' });
      io.to(roomOf(call.calleeId)).emit('call:ended', { callId, reason: 'hangup' });
      await logCall(call, wasConnected ? 'completed' : 'cancelled');
      clearCall(call);
    });

    /* ---------------------------------------------------- disconnect --- */

    socket.on('disconnect', async () => {
      if (!userId) return;

      const wentOffline = markOffline(userId, socket.id);
      if (!wentOffline) return; // another tab of theirs is still connected

      // Drop any call this user was part of, so the other side is not left
      // listening to silence.
      const callId = busy.get(Number(userId));
      if (callId) {
        const call = calls.get(callId);
        if (call) {
          const wasConnected = call.state === 'connected';
          io.to(roomOf(call.callerId)).emit('call:ended', { callId, reason: 'disconnected' });
          io.to(roomOf(call.calleeId)).emit('call:ended', { callId, reason: 'disconnected' });
          await logCall(call, wasConnected ? 'completed' : 'missed');
          clearCall(call);
        }
      }

      try {
        const friends = await db.query(
          `SELECT CASE WHEN user_id = ? THEN friend_id ELSE user_id END AS friend_id
           FROM friendships
           WHERE status = 'accepted' AND (user_id = ? OR friend_id = ?)`,
          [userId, userId, userId]
        );
        for (const f of friends) {
          io.to(roomOf(f.friend_id)).emit('presence:update', { userId, online: false });
        }
      } catch (_) {
        // presence is best-effort
      }
    });
  });

  console.log('  💬 Friend chat & voice-call signalling initialised');
}

module.exports = initChatSocket;
