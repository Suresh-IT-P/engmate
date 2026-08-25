const db = require('../config/db');
const { success, error } = require('../utils/response');

async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user.id;

    // Profile & Level
    const profiles = await db.query(
      `SELECT p.*, l.name as level_name, l.title as level_title, l.badge_icon
       FROM user_profiles p
       LEFT JOIN learning_levels l ON p.current_level = l.id
       WHERE p.user_id = ?`,
      [userId]
    );
    const profile = profiles[0] || {};

    // Streak
    const streaks = await db.query('SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?', [userId]);
    const streak = streaks[0] || { current_streak: 1, longest_streak: 1 };

    // Today's Daily Goal
    const dailyGoals = await db.query(
      `SELECT target_xp, earned_xp, target_minutes, spent_minutes, is_completed
       FROM daily_goals WHERE user_id = ? AND goal_date = DATE('now')`,
      [userId]
    );
    const dailyGoal = dailyGoals[0] || { target_xp: 50, earned_xp: 0, target_minutes: 20, spent_minutes: 0, is_completed: 0 };
    const goalProgressPct = Math.min(100, Math.round(((dailyGoal.earned_xp / Math.max(1, dailyGoal.target_xp)) * 0.5 + (dailyGoal.spent_minutes / Math.max(1, dailyGoal.target_minutes)) * 0.5) * 100));

    // Completed Lessons Count
    const completedLessons = await db.query('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ?', [userId]);

    // Mastered Vocab Count
    const vocabStats = await db.query(
      `SELECT
         COUNT(*) as total_learned,
         SUM(CASE WHEN status = 'mastered' THEN 1 ELSE 0 END) as mastered_count
       FROM user_vocabulary WHERE user_id = ?`,
      [userId]
    );

    // Unreviewed Mistakes Count
    const mistakeStats = await db.query(
      'SELECT COUNT(*) as count FROM mistake_logs WHERE user_id = ? AND is_reviewed = 0',
      [userId]
    );

    // Continue Learning Lesson Recommendation
    const nextLesson = await db.query(
      `SELECT l.id, l.title, l.tamil_title, l.lesson_type, l.xp_reward, c.title as course_title
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       JOIN courses c ON m.course_id = c.id
       WHERE l.id NOT IN (SELECT lesson_id FROM user_progress WHERE user_id = ?)
       ORDER BY c.order_index ASC, m.order_index ASC, l.order_index ASC
       LIMIT 1`,
      [userId]
    );

    // Recent Achievements
    const recentAchievements = await db.query(
      `SELECT a.*, ua.unlocked_at
       FROM user_achievements ua
       JOIN achievements a ON ua.achievement_id = a.id
       WHERE ua.user_id = ?
       ORDER BY ua.unlocked_at DESC
       LIMIT 4`,
      [userId]
    );

    return success(res, {
      profile: {
        fullName: profile.full_name,
        currentLevel: profile.current_level || 'A1',
        levelTitle: profile.level_title || 'A1 — Beginner Foundation',
        badgeIcon: profile.badge_icon || 'eco',
        xp: profile.xp || 0,
        coins: profile.coins || 100,
        primaryGoal: profile.primary_goal
      },
      streak: {
        current: streak.current_streak || 1,
        longest: streak.longest_streak || 1
      },
      dailyGoal: {
        targetXp: dailyGoal.target_xp,
        earnedXp: dailyGoal.earned_xp,
        targetMinutes: dailyGoal.target_minutes,
        spentMinutes: dailyGoal.spent_minutes,
        progressPct: goalProgressPct,
        isCompleted: Boolean(dailyGoal.is_completed)
      },
      stats: {
        completedLessons: completedLessons[0]?.count || 0,
        wordsLearned: vocabStats[0]?.total_learned || 0,
        wordsMastered: vocabStats[0]?.mastered_count || 0,
        pendingMistakes: mistakeStats[0]?.count || 0
      },
      recommendedLesson: nextLesson[0] || null,
      recentAchievements
    });
  } catch (err) {
    next(err);
  }
}

async function getSkillAnalytics(req, res, next) {
  try {
    const userId = req.user.id;

    // Calculate skill competencies (0-100)
    const lessonCount = (await db.query('SELECT COUNT(*) as c FROM user_progress WHERE user_id = ?', [userId]))[0]?.c || 0;
    const vocabCount = (await db.query('SELECT COUNT(*) as c FROM user_vocabulary WHERE user_id = ?', [userId]))[0]?.c || 0;
    const quizCount = (await db.query('SELECT COUNT(*) as c, AVG(accuracy_pct) as avg_acc FROM quiz_attempts WHERE user_id = ?', [userId]))[0] || {};
    const speakingSessions = (await db.query('SELECT COUNT(*) as c FROM learning_sessions WHERE user_id = ? AND session_type = "speaking"', [userId]))[0]?.c || 0;

    const skills = {
      vocabulary: Math.min(100, Math.round(20 + vocabCount * 8)),
      grammar: Math.min(100, Math.round(30 + lessonCount * 10)),
      speaking: Math.min(100, Math.round(15 + speakingSessions * 15)),
      reading: Math.min(100, Math.round(25 + lessonCount * 6)),
      writing: Math.min(100, Math.round(20 + lessonCount * 7)),
      listening: Math.min(100, Math.round(25 + (quizCount.c || 0) * 10)),
      overallAccuracy: Math.round(quizCount.avg_acc || 82)
    };

    // Activity breakdown by day for the last 7 days
    const weeklySessions = await db.query(
      `SELECT session_date, SUM(xp_earned) as total_xp, SUM(duration_seconds) as total_seconds
       FROM learning_sessions
       WHERE user_id = ?
       GROUP BY session_date
       ORDER BY session_date DESC
       LIMIT 7`,
      [userId]
    );

    return success(res, {
      skills,
      weeklyActivity: weeklySessions
    });
  } catch (err) {
    next(err);
  }
}

async function getMistakes(req, res, next) {
  try {
    const userId = req.user.id;
    const mistakes = await db.query(
      'SELECT * FROM mistake_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    return success(res, mistakes);
  } catch (err) {
    next(err);
  }
}

async function markMistakeReviewed(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await db.execute('UPDATE mistake_logs SET is_reviewed = 1 WHERE id = ? AND user_id = ?', [id, userId]);
    return success(res, { id }, 'Mistake marked as reviewed.');
  } catch (err) {
    next(err);
  }
}

async function getLeaderboard(req, res, next) {
  try {
    const topUsers = await db.query(
      `SELECT u.id, p.full_name, p.current_level, p.xp, s.current_streak
       FROM users u
       JOIN user_profiles p ON u.id = p.user_id
       LEFT JOIN streaks s ON u.id = s.user_id
       WHERE u.status = 'active'
       ORDER BY p.xp DESC
       LIMIT 20`
    );
    return success(res, topUsers);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardStats,
  getSkillAnalytics,
  getMistakes,
  markMistakeReviewed,
  getLeaderboard
};
