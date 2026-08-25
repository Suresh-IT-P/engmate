const db = require('../config/db');
const chatService = require('../services/chatService');
const { success, error } = require('../utils/response');

/**
 * Get all public chat rooms + direct rooms for current user
 */
async function getChatRooms(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;

    // Public rooms
    const publicRooms = await db.query(
      `SELECT r.*,
              (SELECT COUNT(*) FROM chat_messages m WHERE m.room_id = r.id) as message_count,
              (SELECT m.message_text FROM chat_messages m WHERE m.room_id = r.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
              (SELECT m.created_at FROM chat_messages m WHERE m.room_id = r.id ORDER BY m.created_at DESC LIMIT 1) as last_message_at
       FROM chat_rooms r
       WHERE r.room_type = 'public'
       ORDER BY r.created_at ASC`
    );

    // Direct rooms (if user is authenticated)
    let directRooms = [];
    if (userId) {
      directRooms = await db.query(
        `SELECT r.id, r.name, r.room_type, r.created_at,
                u.id as friend_id, u.email as friend_email, u.username as friend_username,
                p.full_name as friend_name, p.avatar_url as friend_avatar, p.current_level as friend_level,
                (SELECT m.message_text FROM chat_messages m WHERE m.room_id = r.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
                (SELECT m.created_at FROM chat_messages m WHERE m.room_id = r.id ORDER BY m.created_at DESC LIMIT 1) as last_message_at
         FROM chat_rooms r
         JOIN chat_room_members rm1 ON r.id = rm1.room_id AND rm1.user_id = ?
         JOIN chat_room_members rm2 ON r.id = rm2.room_id AND rm2.user_id != ?
         JOIN users u ON u.id = rm2.user_id
         JOIN user_profiles p ON u.id = p.user_id
         WHERE r.room_type = 'direct'
         ORDER BY last_message_at DESC`,
        [userId, userId]
      );
    }

    return success(res, {
      publicRooms,
      directRooms
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get or create a direct chat room with a friend
 */
async function getOrCreateDirectRoom(req, res, next) {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;

    if (!friendId) {
      return error(res, 'Friend ID is required.', 400);
    }

    if (Number(friendId) === Number(userId)) {
      return error(res, 'You cannot open a chat with yourself.', 400);
    }

    // Room membership is permanent once created, so it must not be grantable to
    // an arbitrary user id. Same friends-only rule the call path enforces.
    if (!(await chatService.areFriends(userId, friendId))) {
      return error(res, 'You can only start a chat with someone on your friends list.', 403);
    }

    const roomId = `room_dm_${Math.min(userId, friendId)}_${Math.max(userId, friendId)}`;

    const existing = await db.query('SELECT * FROM chat_rooms WHERE id = ?', [roomId]);
    if (existing.length === 0) {
      await db.execute(
        'INSERT INTO chat_rooms (id, name, room_type, created_by) VALUES (?, "Direct Chat", "direct", ?)',
        [roomId, userId]
      );
      await db.execute(
        'INSERT INTO chat_room_members (room_id, user_id) VALUES (?, ?), (?, ?)',
        [roomId, userId, roomId, friendId]
      );
    }

    const friendInfo = await db.query(
      `SELECT u.id, u.username, u.email, p.full_name, p.avatar_url, p.current_level
       FROM users u JOIN user_profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [friendId]
    );

    return success(res, {
      id: roomId,
      room_type: 'direct',
      friend: friendInfo[0] || null
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get message history for a chat room
 */
async function getRoomMessages(req, res, next) {
  try {
    const { roomId } = req.params;
    const { limit = 50 } = req.query;

    // Direct rooms are private. Their ids are derived from the two user ids, so
    // they are trivially enumerable — membership has to be checked server-side.
    const room = await db.query('SELECT room_type FROM chat_rooms WHERE id = ?', [roomId]);
    if (room.length === 0) {
      return error(res, 'Conversation not found.', 404);
    }
    if (room[0].room_type !== 'public') {
      if (!req.user) {
        return error(res, 'Sign in to read this conversation.', 401);
      }
      if (!(await chatService.canAccessRoom(req.user.id, roomId))) {
        return error(res, 'You are not a member of this conversation.', 403);
      }
    }

    const messages = await db.query(
      `SELECT m.id, m.room_id, m.sender_id, m.message_text, m.tamil_translation,
              m.grammar_correction, m.created_at,
              p.full_name as sender_name, p.avatar_url as sender_avatar,
              p.current_level as sender_level, u.role as sender_role
       FROM chat_messages m
       JOIN users u ON m.sender_id = u.id
       JOIN user_profiles p ON m.sender_id = p.user_id
       WHERE m.room_id = ?
       ORDER BY m.created_at ASC
       LIMIT ?`,
      [roomId, parseInt(limit)]
    );

    // Format correction JSON if present
    const formatted = messages.map(msg => {
      let corr = null;
      if (msg.grammar_correction) {
        try {
          corr = JSON.parse(msg.grammar_correction);
        } catch (_) {
          corr = { explanation: msg.grammar_correction };
        }
      }
      return {
        ...msg,
        grammar_correction: corr
      };
    });

    const byMessage = await chatService.getReactionsFor(formatted.map((m) => m.id));
    const withReactions = formatted.map((m) => ({ ...m, reactions: byMessage[m.id] || [] }));

    return success(res, withReactions);
  } catch (err) {
    next(err);
  }
}

/**
 * Send a message in a chat room (with automatic AI English Grammar Doctor)
 */
async function sendMessage(req, res, next) {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;
    const { messageText, checkGrammar = true } = req.body;

    if (!messageText || !messageText.trim()) {
      return error(res, 'Message text is required.', 400);
    }

    // The socket handler gates this; the REST path did not, so the same message
    // could be posted into a stranger's conversation over HTTP.
    if (!(await chatService.canAccessRoom(userId, roomId))) {
      return error(res, 'You are not a member of this conversation.', 403);
    }

    const newMessage = await chatService.createMessage({
      userId,
      roomId,
      messageText,
      checkGrammar
    });

    return success(res, newMessage, 'Message sent.');
  } catch (err) {
    next(err);
  }
}

/**
 * Direct-room detail for the friend chat screen: who the other person is, plus
 * whether they are on your friends list — which is what gates calling them.
 */
async function getDirectRoomDetail(req, res, next) {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;

    if (!(await chatService.canAccessRoom(userId, roomId))) {
      return error(res, 'You are not a member of this conversation.', 403);
    }

    const rooms = await db.query('SELECT id, name, room_type FROM chat_rooms WHERE id = ?', [roomId]);
    const peer = await chatService.getDirectPeer(roomId, userId);

    return success(res, {
      room: rooms[0] || null,
      peer,
      canCall: peer ? await chatService.areFriends(userId, peer.id) : false
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Call history for a room, so the chat timeline can interleave
 * "missed call" and "voice call, 2:14" entries with the messages.
 */
async function getRoomCalls(req, res, next) {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;
    const { limit = 50 } = req.query;

    if (!(await chatService.canAccessRoom(userId, roomId))) {
      return error(res, 'You are not a member of this conversation.', 403);
    }

    const calls = await db.query(
      `SELECT c.id, c.call_id, c.room_id, c.caller_id, c.callee_id, c.call_type,
              c.status, c.duration_seconds, c.started_at, c.ended_at,
              p.full_name as caller_name
       FROM call_logs c
       LEFT JOIN user_profiles p ON p.user_id = c.caller_id
       WHERE c.room_id = ?
       ORDER BY c.started_at ASC
       LIMIT ?`,
      [roomId, parseInt(limit)]
    );

    return success(res, calls);
  } catch (err) {
    next(err);
  }
}

/**
 * Create a public chat room (Admin only)
 */
async function createChatRoom(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, tamil_name, description, room_type = 'public' } = req.body;

    if (!name) {
      return error(res, 'Room name is required.', 400);
    }

    const roomId = `room_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;

    await db.execute(
      `INSERT INTO chat_rooms (id, name, tamil_name, description, room_type, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [roomId, name, tamil_name || name, description || '', room_type, userId]
    );

    return success(res, { id: roomId, name, room_type }, 'Chat room created successfully.', 201);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getChatRooms,
  getOrCreateDirectRoom,
  getDirectRoomDetail,
  getRoomMessages,
  getRoomCalls,
  sendMessage,
  createChatRoom
};
