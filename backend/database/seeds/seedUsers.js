const bcrypt = require('bcryptjs');
const db = require('../../src/config/db');

async function seedUsers() {
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('EnglishMate@2026', salt);

  const users = [
    {
      email: 'admin@englishmate.ai',
      role: 'admin',
      fullName: 'Chief Learning Admin',
      currentLevel: 'C2',
      targetLevel: 'C2',
      xp: 2500,
      dailyGoalMinutes: 30,
      primaryGoal: 'Curriculum Management & Teaching'
    },
    {
      email: 'teacher@englishmate.ai',
      role: 'teacher',
      fullName: 'Mr. Arul Kumar (English Master)',
      currentLevel: 'C1',
      targetLevel: 'C2',
      xp: 1800,
      dailyGoalMinutes: 30,
      primaryGoal: 'Spoken English Coaching'
    },
    {
      email: 'student@englishmate.ai',
      role: 'user',
      fullName: 'Suresh Kumar',
      currentLevel: 'A2',
      targetLevel: 'B2',
      xp: 540,
      dailyGoalMinutes: 30,
      primaryGoal: 'Job Interview & Speaking Fluency'
    }
  ];

  let insertedCount = 0;

  for (const u of users) {
    const existing = await db.query('SELECT id FROM users WHERE email = ?', [u.email]);
    let userId;

    if (existing.length === 0) {
      const res = await db.execute(
        'INSERT INTO users (email, password_hash, role, status, is_verified) VALUES (?, ?, ?, ?, ?)',
        [u.email, defaultPassword, u.role, 'active', 1]
      );
      userId = res.insertId;
      insertedCount++;
    } else {
      userId = existing[0].id;
    }

    // Insert or update profile
    const existingProfile = await db.query('SELECT user_id FROM user_profiles WHERE user_id = ?', [userId]);
    if (existingProfile.length === 0) {
      await db.execute(
        `INSERT INTO user_profiles (user_id, full_name, native_language, current_level, target_level, xp, daily_goal_minutes, primary_goal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, u.fullName, 'Tamil', u.currentLevel, u.targetLevel, u.xp, u.dailyGoalMinutes, u.primaryGoal]
      );
    }

    // Insert default settings
    const existingSettings = await db.query('SELECT user_id FROM user_settings WHERE user_id = ?', [userId]);
    if (existingSettings.length === 0) {
      await db.execute(
        `INSERT INTO user_settings (user_id, theme, sound_effects, tamil_translation_enabled, voice_speed)
         VALUES (?, 'light', 1, 1, 1.0)`,
        [userId]
      );
    }

    // Insert streak record
    const existingStreak = await db.query('SELECT user_id FROM streaks WHERE user_id = ?', [userId]);
    if (existingStreak.length === 0) {
      await db.execute(
        `INSERT INTO streaks (user_id, current_streak, longest_streak)
         VALUES (?, 7, 12)`,
        [userId]
      );
    }

    // If admin, record in admin_users
    if (u.role === 'admin') {
      const existingAdmin = await db.query('SELECT id FROM admin_users WHERE user_id = ?', [userId]);
      if (existingAdmin.length === 0) {
        await db.execute(
          `INSERT INTO admin_users (user_id, role, permissions_json) VALUES (?, 'super_admin', '["all"]')`,
          [userId]
        );
      }
    }
  }

  return { users: users.length, inserted: insertedCount };
}

module.exports = seedUsers;
