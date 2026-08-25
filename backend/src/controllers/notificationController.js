const db = require('../config/db');
const { success, error } = require('../utils/response');

async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const notifications = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30',
      [userId]
    );
    return success(res, notifications);
  } catch (err) {
    next(err);
  }
}

async function markNotificationRead(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await db.execute('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, userId]);
    return success(res, { id }, 'Notification marked as read.');
  } catch (err) {
    next(err);
  }
}

async function markAllRead(req, res, next) {
  try {
    const userId = req.user.id;
    await db.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
    return success(res, {}, 'All notifications marked as read.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllRead
};
