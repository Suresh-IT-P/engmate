const db = require('../config/db');
const aiService = require('./aiService');

/**
 * Chat message creation, shared by the REST controller and the Socket.IO
 * handler. Both entry points must produce identical rows — the AI Grammar
 * Doctor pass in particular — or a message would look different depending on
 * whether it arrived over HTTP or the socket.
 */

/**
 * Run the sender's text past the AI English Doctor.
 * Never throws: a chat message must still send when the AI provider is down.
 */
async function runGrammarDoctor(userId, text) {
  if (text.length <= 5) return { correctionJson: null, tamilTranslation: null };

  try {
    const profile = await db.query('SELECT current_level FROM user_profiles WHERE user_id = ?', [userId]);
    const level = profile[0]?.current_level || 'A1';
    const result = await aiService.correctSentence(text, level);

    return {
      correctionJson: result && result.hasMistake
        ? JSON.stringify({
            improved: result.improved,
            explanation: result.explanation,
            tamilExplanation: result.tamilExplanation,
            rule: result.rule
          })
        : null,
      tamilTranslation: (result && result.tamilTranslation) || null
    };
  } catch (err) {
    console.warn('[chatService] AI grammar doctor skipped:', err.message);
    return { correctionJson: null, tamilTranslation: null };
  }
}

/**
 * Persist a chat message and return it in the exact shape the clients render.
 * @returns {Promise<object>} the stored message, correction already parsed
 */
async function createMessage({ userId, roomId, messageText, checkGrammar = true }) {
  const text = String(messageText || '').trim();
  if (!text) throw new Error('Message text is required.');

  const { correctionJson, tamilTranslation } = checkGrammar
    ? await runGrammarDoctor(userId, text)
    : { correctionJson: null, tamilTranslation: null };

  const result = await db.execute(
    `INSERT INTO chat_messages (room_id, sender_id, message_text, tamil_translation, grammar_correction)
     VALUES (?, ?, ?, ?, ?)`,
    [roomId, userId, text, tamilTranslation, correctionJson]
  );

  const sender = await db.query(
    `SELECT p.full_name, p.avatar_url, p.current_level, u.role
     FROM user_profiles p JOIN users u ON p.user_id = u.id
     WHERE p.user_id = ?`,
    [userId]
  );

  return {
    id: result.insertId,
    room_id: roomId,
    sender_id: userId,
    message_text: text,
    tamil_translation: tamilTranslation,
    grammar_correction: correctionJson ? JSON.parse(correctionJson) : null,
    created_at: new Date().toISOString(),
    sender_name: sender[0]?.full_name || 'User',
    sender_avatar: sender[0]?.avatar_url || null,
    sender_level: sender[0]?.current_level || 'A1',
    sender_role: sender[0]?.role || 'user'
  };
}

/** Emoji are user input; keep them short and strip anything with markup. */
function cleanEmoji(raw) {
  const emoji = String(raw || '').trim();
  if (!emoji || emoji.length > 16) return null;
  if (/[<>&"'\\/]/.test(emoji)) return null;
  return emoji;
}

/**
 * Toggle one user's reaction on a message.
 * Re-reacting with the same emoji removes it, which is what the UNIQUE key on
 * (message_id, user_id, emoji) is there to support.
 *
 * @returns {Promise<{messageId:number, reactions:Array, added:boolean}>}
 */
async function toggleReaction({ userId, messageId, emoji, roomId }) {
  const clean = cleanEmoji(emoji);
  if (!clean) throw new Error('That is not a usable reaction.');

  const id = parseInt(messageId, 10);
  if (!Number.isFinite(id)) throw new Error('Unknown message.');

  // The message must belong to the room the caller claims to be reacting in,
  // so a crafted event cannot reach a conversation the user is not part of.
  const owner = await db.query('SELECT room_id FROM chat_messages WHERE id = ?', [id]);
  if (owner.length === 0) throw new Error('Unknown message.');
  if (roomId && owner[0].room_id !== roomId) throw new Error('That message is not in this conversation.');
  if (!(await canAccessRoom(userId, owner[0].room_id))) throw new Error('You are not a member of this conversation.');

  const existing = await db.query(
    'SELECT id FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?',
    [id, userId, clean]
  );

  let added;
  if (existing.length > 0) {
    await db.execute('DELETE FROM message_reactions WHERE id = ?', [existing[0].id]);
    added = false;
  } else {
    await db.execute(
      'INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)',
      [id, userId, clean]
    );
    added = true;
  }

  return {
    messageId: id,
    roomId: owner[0].room_id,
    emoji: clean,
    added,
    reactions: await getReactionsFor([id]).then((m) => m[id] || [])
  };
}

/**
 * Reactions for a batch of message ids, as { [messageId]: [{emoji, user_id}] }.
 * Batched deliberately: one query per message would be N+1 on every room open.
 */
async function getReactionsFor(messageIds = []) {
  const ids = messageIds.map((n) => parseInt(n, 10)).filter(Number.isFinite);
  if (ids.length === 0) return {};

  const placeholders = ids.map(() => '?').join(',');
  const rows = await db.query(
    `SELECT r.message_id, r.emoji, r.user_id, p.full_name AS user_name
     FROM message_reactions r
     LEFT JOIN user_profiles p ON p.user_id = r.user_id
     WHERE r.message_id IN (${placeholders})
     ORDER BY r.created_at ASC`,
    ids
  );

  const byMessage = {};
  for (const row of rows) {
    (byMessage[row.message_id] = byMessage[row.message_id] || []).push({
      emoji: row.emoji,
      user_id: row.user_id,
      user_name: row.user_name || 'Someone'
    });
  }
  return byMessage;
}

/** True when the two users are in an accepted friendship, in either direction. */
async function areFriends(userId, otherId) {
  if (!userId || !otherId || Number(userId) === Number(otherId)) return false;
  const rows = await db.query(
    `SELECT 1 FROM friendships
     WHERE status = 'accepted'
       AND ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
     LIMIT 1`,
    [userId, otherId, otherId, userId]
  );
  return rows.length > 0;
}

/** True when the user is a member of the room (public rooms are open to all). */
async function canAccessRoom(userId, roomId) {
  const room = await db.query('SELECT room_type FROM chat_rooms WHERE id = ?', [roomId]);
  if (room.length === 0) return false;
  if (room[0].room_type === 'public') return true;

  const member = await db.query(
    'SELECT 1 FROM chat_room_members WHERE room_id = ? AND user_id = ? LIMIT 1',
    [roomId, userId]
  );
  return member.length > 0;
}

/** The other member of a direct room, or null if this is not a 1:1 room. */
async function getDirectPeer(roomId, userId) {
  const rows = await db.query(
    `SELECT u.id, u.username, p.full_name, p.avatar_url, p.current_level
     FROM chat_room_members rm
     JOIN users u ON u.id = rm.user_id
     JOIN user_profiles p ON p.user_id = u.id
     WHERE rm.room_id = ? AND rm.user_id != ?
     LIMIT 1`,
    [roomId, userId]
  );
  return rows[0] || null;
}

module.exports = {
  createMessage,
  toggleReaction,
  getReactionsFor,
  areFriends,
  canAccessRoom,
  getDirectPeer
};
