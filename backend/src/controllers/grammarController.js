const db = require('../config/db');
const { success, error } = require('../utils/response');

async function getGrammarTopics(req, res, next) {
  try {
    const { level_id } = req.query;
    let sql = 'SELECT * FROM grammar_topics WHERE 1=1';
    const params = [];

    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }
    sql += ' ORDER BY order_index ASC';

    const topics = await db.query(sql, params);
    for (const t of topics) {
      t.examples = await db.query('SELECT * FROM grammar_examples WHERE grammar_id = ? ORDER BY order_index ASC', [t.id]);
    }

    return success(res, topics);
  } catch (err) {
    next(err);
  }
}

async function getGrammarTopicById(req, res, next) {
  try {
    const { id } = req.params;
    const topics = await db.query('SELECT * FROM grammar_topics WHERE id = ?', [id]);

    if (topics.length === 0) {
      return error(res, 'Grammar topic not found', 404);
    }

    const topic = topics[0];
    topic.examples = await db.query('SELECT * FROM grammar_examples WHERE grammar_id = ? ORDER BY order_index ASC', [id]);
    
    // Fetch related exercises
    const exercises = await db.query('SELECT * FROM exercises WHERE grammar_id = ?', [id]);
    for (const ex of exercises) {
      const questions = await db.query('SELECT * FROM questions WHERE exercise_id = ?', [ex.id]);
      for (const q of questions) {
        q.options = await db.query('SELECT id, option_text, tamil_text FROM question_options WHERE question_id = ?', [q.id]);
      }
      ex.questions = questions;
    }
    topic.exercises = exercises;

    return success(res, topic);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getGrammarTopics,
  getGrammarTopicById
};
