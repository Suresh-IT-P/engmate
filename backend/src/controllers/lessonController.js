const db = require('../config/db');
const analyticsService = require('../services/analyticsService');
const { success, error } = require('../utils/response');

async function getLessonById(req, res, next) {
  try {
    const { id } = req.params;
    const lessons = await db.query('SELECT * FROM lessons WHERE id = ?', [id]);

    if (lessons.length === 0) {
      return error(res, 'Lesson not found', 404);
    }

    const lesson = lessons[0];
    const contents = await db.query(
      'SELECT * FROM lesson_content WHERE lesson_id = ? ORDER BY order_index ASC',
      [id]
    );
    const exercises = await db.query(
      'SELECT * FROM exercises WHERE lesson_id = ? ORDER BY order_index ASC',
      [id]
    );

    // Fetch questions and options for linked exercises
    for (const ex of exercises) {
      const questions = await db.query('SELECT * FROM questions WHERE exercise_id = ? ORDER BY order_index ASC', [ex.id]);
      for (const q of questions) {
        const options = await db.query('SELECT id, option_text, tamil_text, match_target FROM question_options WHERE question_id = ?', [q.id]);
        q.options = options;
      }
      ex.questions = questions;
    }

    let isCompleted = false;
    if (req.user) {
      const prog = await db.query('SELECT * FROM user_progress WHERE user_id = ? AND lesson_id = ?', [req.user.id, id]);
      isCompleted = prog.length > 0;
    }

    return success(res, {
      ...lesson,
      contents,
      exercises,
      is_completed: isCompleted
    });
  } catch (err) {
    next(err);
  }
}

async function completeLesson(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { score = 100, durationSeconds = 300 } = req.body;

    const lessons = await db.query('SELECT xp_reward FROM lessons WHERE id = ?', [id]);
    if (lessons.length === 0) {
      return error(res, 'Lesson not found', 404);
    }

    const xpToAward = lessons[0].xp_reward || 25;

    // Record user progress
    const existing = await db.query('SELECT id FROM user_progress WHERE user_id = ? AND lesson_id = ?', [userId, id]);
    if (existing.length === 0) {
      await db.execute(
        'INSERT INTO user_progress (user_id, lesson_id, status, score) VALUES (?, ?, "completed", ?)',
        [userId, id, score]
      );
    } else {
      await db.execute(
        'UPDATE user_progress SET score = ?, completed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND lesson_id = ?',
        [score, userId, id]
      );
    }

    // Award XP, update streak, goal, achievements
    const activityResult = await analyticsService.recordActivity({
      userId,
      xpEarned: xpToAward,
      durationSeconds,
      sessionType: 'lesson',
      targetId: id
    });

    return success(res, {
      lessonId: id,
      xpAwarded: xpToAward,
      currentStreak: activityResult.currentStreak,
      newAchievements: activityResult.newlyUnlocked
    }, 'Lesson completed successfully! Great job!');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLessonById,
  completeLesson
};
