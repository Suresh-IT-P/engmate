const db = require('../config/db');
const { success, error } = require('../utils/response');

async function getBookmarks(req, res, next) {
  try {
    const userId = req.user.id;
    const { type } = req.query;
    let sql = 'SELECT * FROM bookmarks WHERE user_id = ?';
    const params = [userId];
    if (type) {
      sql += ' AND item_type = ?';
      params.push(type);
    }
    sql += ' ORDER BY created_at DESC';
    const bookmarks = await db.query(sql, params);
    return success(res, bookmarks);
  } catch (err) {
    next(err);
  }
}

async function addBookmark(req, res, next) {
  try {
    const userId = req.user.id;
    const { itemType, itemId, title, subtext } = req.body;

    if (!itemType || !itemId) {
      return error(res, 'Item type and Item ID are required.', 400);
    }

    const existing = await db.query(
      'SELECT id FROM bookmarks WHERE user_id = ? AND item_type = ? AND item_id = ?',
      [userId, itemType, itemId]
    );

    if (existing.length > 0) {
      return success(res, existing[0], 'Item already bookmarked.');
    }

    const result = await db.execute(
      `INSERT INTO bookmarks (user_id, item_type, item_id, title, subtext)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, itemType, itemId, title || itemId, subtext || '']
    );

    return success(res, { id: result.insertId, itemType, itemId }, 'Bookmark saved.', 201);
  } catch (err) {
    next(err);
  }
}

async function removeBookmark(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await db.execute('DELETE FROM bookmarks WHERE id = ? AND user_id = ?', [id, userId]);
    return success(res, { id }, 'Bookmark removed.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark
};
