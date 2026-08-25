const db = require('../config/db');

class AnalyticsService {
  /**
   * Award XP and update user streak, daily goal, and achievements
   */
  async recordActivity({ userId, xpEarned = 10, durationSeconds = 60, sessionType = 'lesson', targetId = null }) {
    // 1. Log learning session
    await db.execute(
      `INSERT INTO learning_sessions (user_id, session_type, target_id, duration_seconds, xp_earned, session_date)
       VALUES (?, ?, ?, ?, ?, CURDATE())`,
      [userId, sessionType, targetId, durationSeconds, xpEarned]
    );

    // 2. Update user profile total XP
    await db.execute(
      'UPDATE user_profiles SET xp = xp + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [xpEarned, userId]
    );

    // 3. Update Streak
    const todayStr = new Date().toISOString().slice(0, 10);
    const streakRows = await db.query('SELECT current_streak, longest_streak, last_activity_date FROM streaks WHERE user_id = ?', [userId]);

    let currentStreak = 1;
    let longestStreak = 1;

    if (streakRows.length > 0) {
      const lastDate = streakRows[0].last_activity_date ? streakRows[0].last_activity_date.toString().slice(0, 10) : null;
      currentStreak = streakRows[0].current_streak;
      longestStreak = streakRows[0].longest_streak;

      if (lastDate !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);

        if (lastDate === yesterdayStr) {
          currentStreak += 1;
        } else if (!lastDate) {
          currentStreak = 1;
        } else {
          currentStreak = 1; // Streak reset if missed yesterday
        }

        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }

        await db.execute(
          `UPDATE streaks SET current_streak = ?, longest_streak = ?, last_activity_date = CURDATE(), updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
          [currentStreak, longestStreak, userId]
        );
      }
    } else {
      await db.execute(
        `INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date) VALUES (?, 1, 1, CURDATE())`,
        [userId]
      );
    }

    // 4. Update Daily Goal
    const spentMinutes = Math.max(1, Math.round(durationSeconds / 60));
    const goalRows = await db.query(
      `SELECT id, target_xp, earned_xp, target_minutes, spent_minutes, is_completed FROM daily_goals
       WHERE user_id = ? AND goal_date = CURDATE()`,
      [userId]
    );

    if (goalRows.length > 0) {
      const newEarnedXp = goalRows[0].earned_xp + xpEarned;
      const newSpentMins = goalRows[0].spent_minutes + spentMinutes;
      const isCompleted = (newEarnedXp >= goalRows[0].target_xp || newSpentMins >= goalRows[0].target_minutes) ? 1 : 0;

      await db.execute(
        `UPDATE daily_goals SET earned_xp = ?, spent_minutes = ?, is_completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [newEarnedXp, newSpentMins, isCompleted, goalRows[0].id]
      );
    } else {
      await db.execute(
        `INSERT INTO daily_goals (user_id, goal_date, target_xp, earned_xp, target_minutes, spent_minutes, is_completed)
         VALUES (?, CURDATE(), 50, ?, 20, ?, ?)`,
        [userId, xpEarned, spentMinutes, (xpEarned >= 50 || spentMinutes >= 20) ? 1 : 0]
      );
    }

    // 5. Check and unlock achievements
    const newlyUnlocked = await this.checkAchievements(userId);

    return {
      xpEarned,
      currentStreak,
      longestStreak,
      newlyUnlocked
    };
  }

  async checkAchievements(userId) {
    const unlocked = [];

    // Check completed lessons count
    const lessonCountRes = await db.query('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ?', [userId]);
    const lessonCount = lessonCountRes[0]?.count || 0;

    if (lessonCount >= 1) {
      const u = await this.awardAchievement(userId, 'ach_first_lesson');
      if (u) unlocked.push(u);
    }

    // Check streak
    const streakRes = await db.query('SELECT current_streak FROM streaks WHERE user_id = ?', [userId]);
    const streak = streakRes[0]?.current_streak || 0;
    if (streak >= 3) {
      const u = await this.awardAchievement(userId, 'ach_streak_3');
      if (u) unlocked.push(u);
    }
    if (streak >= 7) {
      const u = await this.awardAchievement(userId, 'ach_streak_7');
      if (u) unlocked.push(u);
    }

    // Check vocab mastered
    const vocabCountRes = await db.query('SELECT COUNT(*) as count FROM user_vocabulary WHERE user_id = ? AND status = "mastered"', [userId]);
    const vocabCount = vocabCountRes[0]?.count || 0;
    if (vocabCount >= 10) {
      const u = await this.awardAchievement(userId, 'ach_vocab_10');
      if (u) unlocked.push(u);
    }

    return unlocked;
  }

  async awardAchievement(userId, achievementId) {
    const existing = await db.query(
      'SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
      [userId, achievementId]
    );

    if (existing.length === 0) {
      const ach = await db.query('SELECT title, tamil_title, description, icon, xp_reward FROM achievements WHERE id = ?', [achievementId]);
      if (ach.length > 0) {
        await db.execute(
          'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
          [userId, achievementId]
        );
        // Bonus XP
        await db.execute('UPDATE user_profiles SET xp = xp + ? WHERE user_id = ?', [ach[0].xp_reward, userId]);
        // Notification
        await db.execute(
          `INSERT INTO notifications (user_id, title, tamil_title, message, notification_type)
           VALUES (?, ?, ?, ?, 'achievement')`,
          [userId, `🏆 Achievement Unlocked: ${ach[0].title}!`, `சாதனை பதக்கம்: ${ach[0].tamil_title}`, ach[0].description]
        );
        return ach[0];
      }
    }
    return null;
  }
}

module.exports = new AnalyticsService();
