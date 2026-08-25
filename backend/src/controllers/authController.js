const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/env');
const { success, error } = require('../utils/response');

async function register(req, res, next) {
  try {
    const { phoneNumber, password, fullName, username, nativeLanguage = 'Tamil', targetLevel = 'B1', primaryGoal = 'Daily conversation' } = req.body;

    if (!phoneNumber || !password || !fullName) {
      return error(res, 'Phone number, password, and full name are required.', 400);
    }

    if (password.length < 6) {
      return error(res, 'Password must be at least 6 characters.', 400);
    }

    const cleanPhone = phoneNumber.trim();
    const cleanUsername = username ? username.toLowerCase().trim() : null;
    // Generate a unique internal email from the phone number for DB storage
    const internalEmail = `${cleanPhone.replace(/[^0-9]/g, '')}@phone.englishmate.local`;

    const existingPhone = await db.query('SELECT id FROM users WHERE phone_number = ?', [cleanPhone]);
    if (existingPhone.length > 0) {
      return error(res, 'An account with this phone number already exists.', 409);
    }

    if (cleanUsername) {
      const existingUser = await db.query('SELECT id FROM users WHERE username = ?', [cleanUsername]);
      if (existingUser.length > 0) {
        return error(res, 'This username is already taken. Please choose another.', 409);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // current_level and target_level are foreign keys into learning_levels.
    // Passing an id that is not there fails the constraint and 500s, so resolve
    // both against the table and fall back to NULL rather than guessing.
    const knownLevels = await db.query('SELECT id FROM learning_levels');
    const levelIds = new Set(knownLevels.map((l) => l.id));
    const startLevel = levelIds.has('A1') ? 'A1' : (knownLevels[0]?.id ?? null);
    const wantedTarget = String(targetLevel || '').trim().toUpperCase();
    const goalLevel = levelIds.has(wantedTarget) ? wantedTarget : startLevel;

    // One transaction: a failure on any insert below must not leave a users row
    // behind. It used to — and since phone_number is unique, that person could
    // never register again, only ever getting "this phone number already exists".
    const userId = await db.withTransaction(async (tx) => {
      const userRes = await tx.execute(
        'INSERT INTO users (email, username, phone_number, password_hash, role, status, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [internalEmail, cleanUsername, cleanPhone, passwordHash, 'user', 'active', 1]
      );
      const newId = userRes.insertId;

      await tx.execute(
        `INSERT INTO user_profiles (user_id, full_name, username, phone_number, native_language, target_level, current_level, xp, coins, daily_goal_minutes, primary_goal)
         VALUES (?, ?, ?, ?, ?, ?, ?, 50, 100, 20, ?)`,
        [newId, fullName.trim(), cleanUsername, cleanPhone, nativeLanguage, goalLevel, startLevel, primaryGoal]
      );

      await tx.execute(
        `INSERT INTO user_settings (user_id, theme, sound_effects, tamil_translation_enabled, voice_speed)
         VALUES (?, 'light', 1, 1, 1.0)`,
        [newId]
      );

      await tx.execute(
        `INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date)
         VALUES (?, 1, 1, CURDATE())`,
        [newId]
      );

      await tx.execute(
        `INSERT INTO notifications (user_id, title, tamil_title, message, notification_type)
         VALUES (?, 'Welcome to English Mate! 🎉', 'வணக்கம்! வாழ்த்துகள்', 'Start your journey with Lesson 1 or add your friends to practice together!', 'system')`,
        [newId]
      );

      return newId;
    }).catch((txErr) => {
      if (txErr && (txErr.code === 'ER_DUP_ENTRY' || /Duplicate entry/i.test(txErr.message))) {
        const conflict = new Error('An account with this phone number or username already exists.');
        conflict.status = 409;
        throw conflict;
      }
      throw txErr;
    });

    const token = jwt.sign({ userId, role: 'user' }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return success(res, {
      token,
      user: {
        id: userId,
        phoneNumber: cleanPhone,
        username: cleanUsername,
        role: 'user',
        fullName: fullName.trim(),
        currentLevel: startLevel,
        targetLevel: goalLevel,
        xp: 50,
        streak: 1
      }
    }, 'Account registered successfully.', 201);
  } catch (err) {
    if (err.status === 409) return error(res, err.message, 409);
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, identifier, password } = req.body;
    const loginId = (identifier || email || '').trim().toLowerCase();

    if (!loginId || !password) {
      return error(res, 'Phone number and password are required.', 400);
    }

    const users = await db.query(
      'SELECT id, email, username, phone_number, password_hash, role, status FROM users WHERE LOWER(email) = ? OR LOWER(username) = ? OR phone_number = ?',
      [loginId, loginId, loginId]
    );

    if (users.length === 0) {
      return error(res, 'Invalid credentials.', 401);
    }

    const user = users[0];
    if (user.status !== 'active') {
      return error(res, 'Account is disabled or inactive.', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return error(res, 'Invalid credentials.', 401);
    }

    // Fetch profile and settings
    const profiles = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [user.id]);
    const settings = await db.query('SELECT * FROM user_settings WHERE user_id = ?', [user.id]);
    const streaks = await db.query('SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?', [user.id]);

    const profile = profiles[0] || {};
    const setting = settings[0] || {};
    const streak = streaks[0] || { current_streak: 1, longest_streak: 1 };

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return success(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username || profile.username,
        phoneNumber: user.phone_number || profile.phone_number,
        role: user.role,
        fullName: profile.full_name || 'Learner',
        currentLevel: profile.current_level || 'A1',
        targetLevel: profile.target_level || 'B1',
        xp: profile.xp || 0,
        coins: profile.coins || 100,
        dailyGoalMinutes: profile.daily_goal_minutes || 20,
        speakingConfidence: profile.speaking_confidence || 'beginner',
        primaryGoal: profile.primary_goal || 'Daily conversation',
        streak: streak.current_streak || 1,
        longestStreak: streak.longest_streak || 1,
        settings: setting
      }
    }, 'Login successful.');
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const userId = req.user.id;
    const users = await db.query('SELECT id, email, username, phone_number, role, status, created_at FROM users WHERE id = ?', [userId]);
    const profiles = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    const settings = await db.query('SELECT * FROM user_settings WHERE user_id = ?', [userId]);
    const streaks = await db.query('SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?', [userId]);

    return success(res, {
      user: users[0],
      profile: profiles[0] || {},
      settings: settings[0] || {},
      streak: streaks[0] || { current_streak: 0, longest_streak: 0 }
    });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { fullName, username, phoneNumber, currentLevel, targetLevel, primaryGoal, dailyGoalMinutes, speakingConfidence } = req.body;

    const cleanUsername = username ? username.trim().toLowerCase() : undefined;
    const cleanPhone = phoneNumber ? phoneNumber.trim() : undefined;

    if (cleanUsername) {
      const existing = await db.query('SELECT id FROM users WHERE LOWER(username) = ? AND id != ?', [cleanUsername, userId]);
      if (existing.length > 0) {
        return error(res, 'This username is already in use by another user.', 409);
      }
      await db.execute('UPDATE users SET username = ? WHERE id = ?', [cleanUsername, userId]);
    }

    if (cleanPhone) {
      await db.execute('UPDATE users SET phone_number = ? WHERE id = ?', [cleanPhone, userId]);
    }

    await db.execute(
      `UPDATE user_profiles
       SET full_name = COALESCE(?, full_name),
           username = COALESCE(?, username),
           phone_number = COALESCE(?, phone_number),
           current_level = COALESCE(?, current_level),
           target_level = COALESCE(?, target_level),
           primary_goal = COALESCE(?, primary_goal),
           daily_goal_minutes = COALESCE(?, daily_goal_minutes),
           speaking_confidence = COALESCE(?, speaking_confidence),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [fullName, cleanUsername, cleanPhone, currentLevel, targetLevel, primaryGoal, dailyGoalMinutes, speakingConfidence, userId]
    );

    const updated = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    return success(res, updated[0], 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const userId = req.user.id;
    const { theme, soundEffects, voiceSpeed, tamilTranslationEnabled, dailyReminderTime } = req.body;

    await db.execute(
      `UPDATE user_settings
       SET theme = COALESCE(?, theme),
           sound_effects = COALESCE(?, sound_effects),
           voice_speed = COALESCE(?, voice_speed),
           tamil_translation_enabled = COALESCE(?, tamil_translation_enabled),
           daily_reminder_time = COALESCE(?, daily_reminder_time),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [theme, soundEffects, voiceSpeed, tamilTranslationEnabled, dailyReminderTime, userId]
    );

    const updated = await db.query('SELECT * FROM user_settings WHERE user_id = ?', [userId]);
    return success(res, updated[0], 'Settings updated successfully.');
  } catch (err) {
    next(err);
  }
}

async function submitPlacementTest(req, res, next) {
  try {
    const userId = req.user.id;
    const { score, totalQuestions, answers } = req.body;

    const percentage = (score / Math.max(1, totalQuestions)) * 100;
    let recommendedLevel = 'A1';

    if (percentage >= 85) recommendedLevel = 'B2';
    else if (percentage >= 65) recommendedLevel = 'B1';
    else if (percentage >= 40) recommendedLevel = 'A2';
    else recommendedLevel = 'A1';

    await db.execute(
      'UPDATE user_profiles SET current_level = ?, xp = xp + 100 WHERE user_id = ?',
      [recommendedLevel, userId]
    );

    // Record quiz attempt
    await db.execute(
      `INSERT INTO quiz_attempts (user_id, quiz_type, target_id, score, total_questions, correct_count, accuracy_pct, xp_earned)
       VALUES (?, 'placement', 'placement_test_diag', ?, ?, ?, ?, 100)`,
      [userId, score, totalQuestions, score, percentage]
    );

    return success(res, {
      score,
      percentage: Math.round(percentage),
      recommendedLevel,
      xpAwarded: 100
    }, 'Placement test evaluated successfully.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updateSettings,
  submitPlacementTest
};
