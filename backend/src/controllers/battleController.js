const db = require('../config/db');
const { success, error } = require('../utils/response');

/** The pseudo-topic that draws from every bank at once. */
const MIXED = 'mixed';

const shapeQuestion = (row) => ({
  id: row.id,
  topic: row.topic_id,
  question: row.question_text,
  options: [row.option_a, row.option_b, row.option_c, row.option_d],
  ans: row.answer_index,
  explanation: row.explanation,
  difficulty: row.difficulty
});

async function getBattleTopics(req, res, next) {
  try {
    const topics = await db.query(
      `SELECT t.id, t.title, t.tamil_title, t.icon, t.order_index,
              COUNT(q.id) AS question_count
         FROM battle_topics t
         LEFT JOIN battle_questions q ON q.topic_id = t.id
        GROUP BY t.id
        ORDER BY t.order_index ASC`
    );

    const total = topics.reduce((sum, t) => sum + Number(t.question_count || 0), 0);

    // "Mixed" is offered first: it is the default match for players who do not
    // want to commit to a single topic.
    return success(res, [
      {
        id: MIXED,
        title: 'Mixed Challenge',
        tamil_title: 'கலப்பு சவால்',
        icon: 'shuffle',
        order_index: 0,
        question_count: total
      },
      ...topics.map((t) => ({ ...t, question_count: Number(t.question_count || 0) }))
    ]);
  } catch (err) {
    next(err);
  }
}

/**
 * Random questions for a match. `topic` may be a topic id or "mixed".
 * The answer index is included: the AI duel scores on the client, and the
 * multiplayer server reads the bank directly rather than through this route.
 */
async function getBattleQuestions(req, res, next) {
  try {
    const { topic = MIXED, difficulty } = req.query;
    const count = Math.max(1, Math.min(50, parseInt(req.query.count, 10) || 10));

    const where = [];
    const params = [];
    if (topic && topic !== MIXED) {
      const known = await db.query('SELECT id FROM battle_topics WHERE id = ?', [topic]);
      if (known.length === 0) return error(res, `Unknown battle topic: ${topic}`, 404);
      where.push('topic_id = ?');
      params.push(topic);
    }
    if (difficulty) {
      where.push('difficulty = ?');
      params.push(difficulty);
    }

    const rows = await db.query(
      `SELECT * FROM battle_questions
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY RANDOM() LIMIT ?`,
      [...params, count]
    );

    if (rows.length === 0) return error(res, 'No questions available for that topic.', 404);

    return success(res, {
      topic,
      total: rows.length,
      questions: rows.map(shapeQuestion)
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getBattleTopics, getBattleQuestions, shapeQuestion, MIXED };
