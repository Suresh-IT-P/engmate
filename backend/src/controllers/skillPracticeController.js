const db = require('../config/db');
const analyticsService = require('../services/analyticsService');
const { success, error } = require('../utils/response');

async function getReadingPassages(req, res, next) {
  try {
    const { level_id } = req.query;
    let sql = 'SELECT * FROM reading_passages WHERE 1=1';
    const params = [];
    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }
    const passages = await db.query(sql, params);
    return success(res, passages);
  } catch (err) {
    next(err);
  }
}

async function getListeningLessons(req, res, next) {
  try {
    const { level_id } = req.query;
    let sql = 'SELECT * FROM listening_lessons WHERE 1=1';
    const params = [];
    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }
    const lessons = await db.query(sql, params);
    return success(res, lessons);
  } catch (err) {
    next(err);
  }
}

async function getWritingPrompts(req, res, next) {
  try {
    const { level_id } = req.query;
    let sql = 'SELECT * FROM writing_prompts WHERE 1=1';
    const params = [];
    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }
    const prompts = await db.query(sql, params);
    return success(res, prompts);
  } catch (err) {
    next(err);
  }
}

async function completeSkillSession(req, res, next) {
  try {
    const userId = req.user.id;
    const { skillType, targetId, durationSeconds = 60, xpEarned = 20 } = req.body;

    const activity = await analyticsService.recordActivity({
      userId,
      xpEarned,
      durationSeconds,
      sessionType: skillType || 'reading',
      targetId
    });

    return success(res, {
      xpEarned,
      currentStreak: activity.currentStreak,
      newAchievements: activity.newlyUnlocked
    }, 'Practice session recorded.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getReadingPassages,
  getListeningLessons,
  getWritingPrompts,
  completeSkillSession
};
