const db = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Search users by username, phone_number, full_name, or email
 */
async function searchUsers(req, res, next) {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return success(res, []);
    }

    const searchTerm = `%${q.trim().toLowerCase()}%`;
    const exactTerm = q.trim();

    const users = await db.query(
      `SELECT u.id, u.username, p.full_name, p.avatar_url, p.current_level, p.xp
       FROM users u
       JOIN user_profiles p ON u.id = p.user_id
       WHERE u.id != ?
         AND (LOWER(u.username) LIKE ? OR LOWER(u.phone_number) LIKE ? OR LOWER(p.full_name) LIKE ? OR LOWER(u.email) = ?)
       LIMIT 20`,
      [userId, searchTerm, searchTerm, searchTerm, exactTerm.toLowerCase()]
    );

    // Get existing friendship status for each user
    for (const u of users) {
      const f = await db.query(
        `SELECT id, user_id, friend_id, status FROM friendships
         WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
        [userId, u.id, u.id, userId]
      );

      if (f.length > 0) {
        if (f[0].status === 'accepted') {
          u.friendStatus = 'friends';
        } else if (f[0].user_id === userId) {
          u.friendStatus = 'request_sent';
        } else {
          u.friendStatus = 'request_received';
        }
        u.friendshipId = f[0].id;
      } else {
        u.friendStatus = 'none';
      }
    }

    return success(res, users);
  } catch (err) {
    next(err);
  }
}

/**
 * Send a friend request by friendId or search identifier (username/phone)
 */
async function sendFriendRequest(req, res, next) {
  try {
    const userId = req.user.id;
    const { friendId, identifier } = req.body;

    let targetId = friendId;

    if (!targetId && identifier) {
      const targetUser = await db.query(
        `SELECT u.id FROM users u
         JOIN user_profiles p ON u.id = p.user_id
         WHERE LOWER(u.username) = ? OR u.phone_number = ? OR LOWER(u.email) = ?`,
        [identifier.trim().toLowerCase(), identifier.trim(), identifier.trim().toLowerCase()]
      );

      if (targetUser.length === 0) {
        return error(res, 'User not found with that username or phone number.', 404);
      }
      targetId = targetUser[0].id;
    }

    if (!targetId) {
      return error(res, 'Friend ID or username/phone identifier is required.', 400);
    }

    if (parseInt(targetId) === parseInt(userId)) {
      return error(res, 'You cannot send a friend request to yourself.', 400);
    }

    // Check existing friendship
    const existing = await db.query(
      `SELECT * FROM friendships
       WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [userId, targetId, targetId, userId]
    );

    if (existing.length > 0) {
      const f = existing[0];
      if (f.status === 'accepted') {
        return error(res, 'You are already friends with this user.', 400);
      } else if (f.user_id === userId) {
        return error(res, 'Friend request already sent.', 400);
      } else {
        // Auto accept if they sent you a request too
        await db.execute('UPDATE friendships SET status = "accepted" WHERE id = ?', [f.id]);
        return success(res, { status: 'accepted' }, 'Friend request accepted!');
      }
    }

    await db.execute(
      'INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, "pending")',
      [userId, targetId]
    );

    // Send notification to friend
    const senderProfile = await db.query('SELECT full_name FROM user_profiles WHERE user_id = ?', [userId]);
    const senderName = senderProfile[0]?.full_name || 'Someone';

    await db.execute(
      `INSERT INTO notifications (user_id, title, tamil_title, message, notification_type)
       VALUES (?, 'New Friend Request 🤝', 'புதிய நண்பர் கோரிக்கை', ?, 'system')`,
      [targetId, `${senderName} sent you a friend request.`]
    );

    return success(res, { status: 'pending' }, 'Friend request sent successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * Get current friends list & pending requests
 */
async function getFriends(req, res, next) {
  try {
    const userId = req.user.id;

    // 1. Accepted Friends
    const friends = await db.query(
      `SELECT f.id as friendship_id, u.id, u.email, u.username, u.phone_number,
              p.full_name, p.avatar_url, p.current_level, p.xp, f.created_at as friends_since
       FROM friendships f
       JOIN users u ON (u.id = CASE WHEN f.user_id = ? THEN f.friend_id ELSE f.user_id END)
       JOIN user_profiles p ON u.id = p.user_id
       WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 'accepted'
       ORDER BY p.xp DESC`,
      [userId, userId, userId]
    );

    // 2. Incoming Pending Requests
    const incomingRequests = await db.query(
      `SELECT f.id as friendship_id, u.id, u.email, u.username, u.phone_number,
              p.full_name, p.avatar_url, p.current_level, f.created_at
       FROM friendships f
       JOIN users u ON u.id = f.user_id
       JOIN user_profiles p ON u.id = p.user_id
       WHERE f.friend_id = ? AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [userId]
    );

    // 3. Outgoing Pending Requests
    const outgoingRequests = await db.query(
      `SELECT f.id as friendship_id, u.id, u.email, u.username, u.phone_number,
              p.full_name, p.avatar_url, p.current_level, f.created_at
       FROM friendships f
       JOIN users u ON u.id = f.friend_id
       JOIN user_profiles p ON u.id = p.user_id
       WHERE f.user_id = ? AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [userId]
    );

    return success(res, {
      friends,
      incomingRequests,
      outgoingRequests
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Accept or reject a friend request
 */
async function respondFriendRequest(req, res, next) {
  try {
    const userId = req.user.id;
    const { friendshipId, action } = req.body; // action: 'accept' | 'reject'

    if (!friendshipId || !['accept', 'reject'].includes(action)) {
      return error(res, 'Friendship ID and action (accept/reject) are required.', 400);
    }

    const f = await db.query('SELECT * FROM friendships WHERE id = ? AND friend_id = ?', [friendshipId, userId]);
    if (f.length === 0) {
      return error(res, 'Friend request not found or unauthorized.', 404);
    }

    if (action === 'accept') {
      await db.execute('UPDATE friendships SET status = "accepted" WHERE id = ?', [friendshipId]);

      // Create direct chat room automatically
      const friendId = f[0].user_id;
      const roomId = `room_dm_${Math.min(userId, friendId)}_${Math.max(userId, friendId)}`;
      
      const existingRoom = await db.query('SELECT id FROM chat_rooms WHERE id = ?', [roomId]);
      if (existingRoom.length === 0) {
        await db.execute(
          'INSERT INTO chat_rooms (id, name, room_type, created_by) VALUES (?, "Direct Chat", "direct", ?)',
          [roomId, userId]
        );
        await db.execute('INSERT INTO chat_room_members (room_id, user_id) VALUES (?, ?), (?, ?)', [roomId, userId, roomId, friendId]);
      }

      return success(res, { status: 'accepted' }, 'Friend request accepted!');
    } else {
      await db.execute('DELETE FROM friendships WHERE id = ?', [friendshipId]);
      return success(res, { status: 'rejected' }, 'Friend request declined.');
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Remove a friend
 */
async function removeFriend(req, res, next) {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    await db.execute(
      `DELETE FROM friendships
       WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [userId, friendId, friendId, userId]
    );

    return success(res, null, 'Friend removed.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  searchUsers,
  sendFriendRequest,
  getFriends,
  respondFriendRequest,
  removeFriend
};
