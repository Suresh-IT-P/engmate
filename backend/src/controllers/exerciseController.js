const db = require('../config/db');
const analyticsService = require('../services/analyticsService');
const { success, error } = require('../utils/response');

async function getExercises(req, res, next) {
  try {
    const { level_id, category_id, lesson_id, grammar_id } = req.query;
    let sql = 'SELECT * FROM exercises WHERE 1=1';
    const params = [];

    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }
    if (category_id) {
      sql += ' AND category_id = ?';
      params.push(category_id);
    }
    if (lesson_id) {
      sql += ' AND lesson_id = ?';
      params.push(lesson_id);
    }
    if (grammar_id) {
      sql += ' AND grammar_id = ?';
      params.push(grammar_id);
    }

    sql += ' ORDER BY order_index ASC';
    const exercises = await db.query(sql, params);

    for (const ex of exercises) {
      const questions = await db.query('SELECT * FROM questions WHERE exercise_id = ? ORDER BY order_index ASC', [ex.id]);
      for (const q of questions) {
        q.options = await db.query('SELECT id, option_text, tamil_text, match_target FROM question_options WHERE question_id = ?', [q.id]);
      }
      ex.questions = questions;
    }

    return success(res, exercises);
  } catch (err) {
    next(err);
  }
}

async function getExerciseById(req, res, next) {
  try {
    const { id } = req.params;
    const exercises = await db.query('SELECT * FROM exercises WHERE id = ?', [id]);

    if (exercises.length === 0) {
      return error(res, 'Exercise not found', 404);
    }

    const ex = exercises[0];
    const questions = await db.query('SELECT * FROM questions WHERE exercise_id = ? ORDER BY order_index ASC', [id]);
    for (const q of questions) {
      q.options = await db.query('SELECT id, option_text, tamil_text, match_target FROM question_options WHERE question_id = ?', [q.id]);
    }
    ex.questions = questions;

    return success(res, ex);
  } catch (err) {
    next(err);
  }
}

async function submitExercise(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { answers = [], durationSeconds = 60 } = req.body; // answers: [{ questionId, answer }]

    const questions = await db.query('SELECT * FROM questions WHERE exercise_id = ?', [id]);
    if (questions.length === 0) {
      return error(res, 'No questions found for this exercise', 404);
    }

    let correctCount = 0;
    const questionResults = [];

    for (const q of questions) {
      const userSub = answers.find(a => Number(a.questionId) === Number(q.id));
      const userAnswerText = userSub ? String(userSub.answer).trim() : '';
      const isCorrect = userAnswerText.toLowerCase() === String(q.correct_answer).trim().toLowerCase();

      if (isCorrect) {
        correctCount++;
      } else {
        // Record in mistake notebook
        await db.execute(
          `INSERT INTO mistake_logs (user_id, source_type, original_input, corrected_input, explanation, tamil_explanation)
           VALUES (?, 'exercise', ?, ?, ?, ?)`,
          [userId, userAnswerText || '[No answer]', q.correct_answer, q.explanation, q.tamil_explanation]
        );
      }

      questionResults.push({
        questionId: q.id,
        isCorrect,
        userAnswer: userAnswerText,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        tamilExplanation: q.tamil_explanation
      });
    }

    const totalQuestions = questions.length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const xpAwarded = Math.round(correctCount * 10);

    const activityRes = await analyticsService.recordActivity({
      userId,
      xpEarned: xpAwarded,
      durationSeconds,
      sessionType: 'exercise',
      targetId: id
    });

    return success(res, {
      exerciseId: id,
      totalQuestions,
      correctCount,
      accuracy,
      xpAwarded,
      currentStreak: activityRes.currentStreak,
      results: questionResults
    });
  } catch (err) {
    next(err);
  }
}

async function getCustomPracticeSet(req, res, next) {
  try {
    const { count = 10, level_id, exercise_type } = req.query;
    const requestedCount = Math.max(1, Math.min(50, parseInt(count, 10) || 10));

    let sql = 'SELECT * FROM questions WHERE 1=1';
    const params = [];

    sql += ' ORDER BY RANDOM() LIMIT ?';
    params.push(requestedCount);

    const questions = await db.query(sql, params);
    for (const q of questions) {
      q.options = await db.query('SELECT id, option_text, tamil_text, match_target FROM question_options WHERE question_id = ?', [q.id]);
    }

    const customExercise = {
      id: `custom_sprint_${Date.now()}`,
      title: `Custom Practice Sprint (${questions.length} Questions)`,
      tamil_title: `தனிப்பயன் பயிற்சி அரங்கம் (${questions.length} வினாக்கள்)`,
      exercise_type: exercise_type || 'mixed',
      questions
    };

    return success(res, customExercise);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getExercises,
  getExerciseById,
  getCustomPracticeSet,
  submitExercise
};
