const db = require('../config/db');
const { success, error } = require('../utils/response');

async function globalSearch(req, res, next) {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return success(res, { vocabulary: [], lessons: [], grammar: [] });
    }

    const term = `%${q.trim()}%`;

    const vocabulary = await db.query(
      'SELECT id, word, meaning, simple_meaning, tamil_meaning, level_id FROM vocabulary WHERE word LIKE ? OR meaning LIKE ? OR tamil_meaning LIKE ? LIMIT 10',
      [term, term, term]
    );

    const lessons = await db.query(
      'SELECT id, title, tamil_title, lesson_type, xp_reward FROM lessons WHERE title LIKE ? OR tamil_title LIKE ? LIMIT 10',
      [term, term]
    );

    const grammar = await db.query(
      'SELECT id, title, tamil_title, summary, tamil_summary, level_id FROM grammar_topics WHERE title LIKE ? OR tamil_title LIKE ? OR summary LIKE ? LIMIT 10',
      [term, term, term]
    );

    return success(res, {
      vocabulary,
      lessons,
      grammar
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  globalSearch
};
