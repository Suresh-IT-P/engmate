const db = require('../config/db');
const spacedRepetitionService = require('../services/spacedRepetitionService');
const analyticsService = require('../services/analyticsService');
const { success, error } = require('../utils/response');

async function getVocabulary(req, res, next) {
  try {
    const { level_id, category_id, search, limit = 50, offset = 0, status, shuffle } = req.query;
    let sql = 'SELECT v.* FROM vocabulary v WHERE 1=1';
    const params = [];

    if (level_id && level_id !== 'all') {
      sql += ' AND v.level_id = ?';
      params.push(level_id);
    }
    if (category_id && category_id !== 'all') {
      sql += ' AND v.category_id = ?';
      params.push(category_id);
    }
    if (search) {
      sql += ' AND (v.word LIKE ? OR v.meaning LIKE ? OR v.tamil_meaning LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const orderClause = shuffle === 'true' ? ' ORDER BY RAND()' : ' ORDER BY v.id ASC';
    sql += `${orderClause} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const words = await db.query(sql, params);

    // Attach examples and user learning status if user is authenticated
    for (const w of words) {
      const examples = await db.query('SELECT sentence, tamil_translation FROM vocabulary_examples WHERE vocabulary_id = ?', [w.id]);
      w.examples = examples;

      if (req.user) {
        const userVocab = await db.query(
          'SELECT status, repetitions, ease_factor, interval_days, next_review_date FROM user_vocabulary WHERE user_id = ? AND vocabulary_id = ?',
          [req.user.id, w.id]
        );
        w.user_status = userVocab[0]?.status || 'unseen';
        w.next_review_date = userVocab[0]?.next_review_date || null;
      }
    }

    const countRes = await db.query('SELECT COUNT(*) as total FROM vocabulary');
    return success(res, {
      items: words,
      total: countRes[0]?.total || words.length,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });
  } catch (err) {
    next(err);
  }
}

async function getWordOfTheDay(req, res, next) {
  try {
    const featured = await db.query('SELECT * FROM vocabulary WHERE is_featured = 1 ORDER BY id DESC LIMIT 1');
    const word = featured.length > 0 ? featured[0] : (await db.query('SELECT * FROM vocabulary ORDER BY id ASC LIMIT 1'))[0];

    if (word) {
      word.examples = await db.query('SELECT sentence, tamil_translation FROM vocabulary_examples WHERE vocabulary_id = ?', [word.id]);
    }

    return success(res, word || null);
  } catch (err) {
    next(err);
  }
}

async function getReviewQueue(req, res, next) {
  try {
    const userId = req.user.id;
    const { limit = 15 } = req.query;

    // Get words due for review or fresh unreviewed words
    const dueWords = await db.query(
      `SELECT v.*, uv.status as user_status, uv.repetitions, uv.ease_factor, uv.interval_days
       FROM user_vocabulary uv
       JOIN vocabulary v ON uv.vocabulary_id = v.id
       WHERE uv.user_id = ? AND uv.next_review_date <= CURRENT_TIMESTAMP
       ORDER BY uv.next_review_date ASC
       LIMIT ?`,
      [userId, parseInt(limit, 10)]
    );

    // If queue is small, fetch unseen words
    if (dueWords.length < parseInt(limit, 10)) {
      const remaining = parseInt(limit, 10) - dueWords.length;
      const unseenWords = await db.query(
        `SELECT v.*, 'unseen' as user_status, 0 as repetitions, 2.5 as ease_factor, 1 as interval_days
         FROM vocabulary v
         WHERE v.id NOT IN (SELECT vocabulary_id FROM user_vocabulary WHERE user_id = ?)
         LIMIT ?`,
        [userId, remaining]
      );
      dueWords.push(...unseenWords);
    }

    for (const w of dueWords) {
      w.examples = await db.query('SELECT sentence, tamil_translation FROM vocabulary_examples WHERE vocabulary_id = ?', [w.id]);
    }

    return success(res, dueWords);
  } catch (err) {
    next(err);
  }
}

async function submitWordReview(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params; // vocabulary id
    const { quality = 4 } = req.body; // 0 to 5

    const existing = await db.query(
      'SELECT * FROM user_vocabulary WHERE user_id = ? AND vocabulary_id = ?',
      [userId, id]
    );

    let reps = 0;
    let interval = 1;
    let ease = 2.5;

    if (existing.length > 0) {
      reps = existing[0].repetitions;
      interval = existing[0].interval_days;
      ease = existing[0].ease_factor;
    }

    const sm2 = spacedRepetitionService.calculateNextReview(quality, reps, interval, ease);

    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO user_vocabulary (user_id, vocabulary_id, status, box_level, repetitions, ease_factor, interval_days, next_review_date, last_reviewed_at, correct_count, mistake_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)`,
        [userId, id, sm2.status, sm2.repetitions, sm2.repetitions, sm2.easeFactor, sm2.intervalDays, sm2.nextReviewDate, quality >= 3 ? 1 : 0, quality < 3 ? 1 : 0]
      );
    } else {
      await db.execute(
        `UPDATE user_vocabulary
         SET status = ?, box_level = ?, repetitions = ?, ease_factor = ?, interval_days = ?, next_review_date = ?, last_reviewed_at = CURRENT_TIMESTAMP,
             correct_count = correct_count + ?, mistake_count = mistake_count + ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [sm2.status, sm2.repetitions, sm2.repetitions, sm2.easeFactor, sm2.intervalDays, sm2.nextReviewDate, quality >= 3 ? 1 : 0, quality < 3 ? 1 : 0, existing[0].id]
      );
    }

    // Award XP (5 XP per reviewed word)
    await analyticsService.recordActivity({
      userId,
      xpEarned: 5,
      durationSeconds: 30,
      sessionType: 'vocabulary',
      targetId: String(id)
    });

    return success(res, sm2, 'Flashcard review recorded.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getVocabulary,
  getWordOfTheDay,
  getReviewQueue,
  submitWordReview
};
