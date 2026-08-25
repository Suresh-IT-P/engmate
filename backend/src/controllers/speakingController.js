const db = require('../config/db');
const aiService = require('../services/aiService');
const analyticsService = require('../services/analyticsService');
const { success, error } = require('../utils/response');

async function getSpeakingTopics(req, res, next) {
  try {
    const { level_id, shuffle } = req.query;
    let sql = 'SELECT * FROM speaking_topics WHERE 1=1';
    const params = [];
    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }
    sql += ' ORDER BY order_index ASC';

    let topics = await db.query(sql, params);

    if (shuffle === 'true' || shuffle === '1') {
      topics = [...topics].sort(() => Math.random() - 0.5);
    }

    return success(res, topics);
  } catch (err) {
    next(err);
  }
}

async function evaluateSpeaking(req, res, next) {
  try {
    const userId = req.user.id;
    const { topicId, targetSentence, spokenTranscript, durationSeconds = 30 } = req.body;

    const evaluation = aiService.evaluateSpeaking({ targetSentence, spokenTranscript });

    const xpEarned = Math.round(Math.max(10, evaluation.accuracyScore * 0.25));

    const activity = await analyticsService.recordActivity({
      userId,
      xpEarned,
      durationSeconds,
      sessionType: 'speaking',
      targetId: topicId
    });

    // If pronunciation had missed words, log into mistake notebook
    if (evaluation.missedWords && evaluation.missedWords.length > 0 && evaluation.accuracyScore < 80) {
      await db.execute(
        `INSERT INTO mistake_logs (user_id, source_type, original_input, corrected_input, explanation, tamil_explanation)
         VALUES (?, 'speaking', ?, ?, ?, ?)`,
        [
          userId,
          spokenTranscript || '[Unclear Speech]',
          targetSentence,
          `Missed or unclear words: ${evaluation.missedWords.join(', ')}`,
          `உச்சரிப்பில் விடுபட்ட அல்லது தெளிவற்ற சொற்கள்: ${evaluation.missedWords.join(', ')}`
        ]
      );
    }

    return success(res, {
      ...evaluation,
      xpAwarded: xpEarned,
      currentStreak: activity.currentStreak,
      newAchievements: activity.newlyUnlocked
    }, 'Speaking practice evaluated.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSpeakingTopics,
  evaluateSpeaking
};
