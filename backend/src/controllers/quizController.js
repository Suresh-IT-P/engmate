const db = require('../config/db');
const analyticsService = require('../services/analyticsService');
const { success, error } = require('../utils/response');

async function getDailyQuiz(req, res, next) {
  try {
    // Select 5 varied questions across vocabulary and grammar
    const questions = await db.query(
      `SELECT q.*, e.title as exercise_title, e.exercise_type
       FROM questions q
       JOIN exercises e ON q.exercise_id = e.id
       ORDER BY q.id ASC
       LIMIT 5`
    );

    for (const q of questions) {
      q.options = await db.query('SELECT id, option_text, tamil_text FROM question_options WHERE question_id = ?', [q.id]);
    }

    return success(res, {
      quizId: 'daily_quiz_' + new Date().toISOString().slice(0, 10),
      title: "Today's Daily Challenge Quiz",
      tamil_title: "இன்றைய தினசரி வினாடி வினா",
      questions
    });
  } catch (err) {
    next(err);
  }
}

async function submitQuizAttempt(req, res, next) {
  try {
    const userId = req.user.id;
    const { quizType = 'daily', targetId = 'daily_quiz', answers = [], timeTakenSeconds = 60 } = req.body;

    let correctCount = 0;
    const totalQuestions = answers.length;

    for (const ans of answers) {
      const qRes = await db.query('SELECT correct_answer, explanation, tamil_explanation FROM questions WHERE id = ?', [ans.questionId]);
      if (qRes.length > 0) {
        const isCorrect = String(ans.userAnswer).trim().toLowerCase() === String(qRes[0].correct_answer).trim().toLowerCase();
        if (isCorrect) {
          correctCount++;
        } else {
          // Log in mistake notebook
          await db.execute(
            `INSERT INTO mistake_logs (user_id, source_type, original_input, corrected_input, explanation, tamil_explanation)
             VALUES (?, 'quiz', ?, ?, ?, ?)`,
            [userId, ans.userAnswer || '[No Answer]', qRes[0].correct_answer, qRes[0].explanation, qRes[0].tamil_explanation]
          );
        }
      }
    }

    const accuracyPct = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);
    const xpEarned = correctCount * 15;

    const attemptRes = await db.execute(
      `INSERT INTO quiz_attempts (user_id, quiz_type, target_id, score, total_questions, correct_count, accuracy_pct, xp_earned, time_taken_seconds)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, quizType, targetId, correctCount, totalQuestions, correctCount, accuracyPct, xpEarned, timeTakenSeconds]
    );

    const activity = await analyticsService.recordActivity({
      userId,
      xpEarned,
      durationSeconds: timeTakenSeconds,
      sessionType: 'quiz',
      targetId
    });

    return success(res, {
      attemptId: attemptRes.insertId,
      score: correctCount,
      totalQuestions,
      accuracyPct,
      xpEarned,
      currentStreak: activity.currentStreak,
      newAchievements: activity.newlyUnlocked
    }, 'Quiz attempt recorded.');
  } catch (err) {
    next(err);
  }
}

async function getQuizHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const history = await db.query(
      'SELECT * FROM quiz_attempts WHERE user_id = ? ORDER BY completed_at DESC LIMIT 20',
      [userId]
    );
    return success(res, history);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDailyQuiz,
  submitQuizAttempt,
  getQuizHistory
};
