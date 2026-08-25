const db = require('../config/db');
const aiService = require('../services/aiService');
const analyticsService = require('../services/analyticsService');
const { success, error } = require('../utils/response');

async function chat(req, res, next) {
  try {
    const userId = req.user.id;
    const { message, conversationId, topicId, persona = 'Maya', role = 'Friendly English Tutor', scenario = 'General Chat', enableTamil = true } = req.body;

    if (!message || message.trim().length === 0) {
      return error(res, 'Message text is required.', 400);
    }

    let convId = conversationId;
    if (!convId) {
      const convRes = await db.execute(
        `INSERT INTO ai_conversations (user_id, topic_id, title, mode)
         VALUES (?, ?, ?, 'tutor')`,
        [userId, topicId || null, `Chat with ${persona}`]
      );
      convId = convRes.insertId;
    }

    // Save user message
    await db.execute(
      `INSERT INTO ai_messages (conversation_id, sender, content)
       VALUES (?, 'user', ?)`,
      [convId, message.trim()]
    );

    // Fetch conversation history
    const historyRows = await db.query(
      'SELECT sender, content FROM ai_messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 10',
      [convId]
    );
    const history = historyRows.reverse();

    // Fetch user profile level
    const profile = await db.query('SELECT current_level FROM user_profiles WHERE user_id = ?', [userId]);
    const userLevel = profile[0]?.current_level || 'A1';

    // Call AI Service
    const aiResponse = await aiService.chat({
      message: message.trim(),
      history,
      persona,
      role,
      scenario,
      level: userLevel,
      enableTamil
    });

    // Save AI message to DB
    await db.execute(
      `INSERT INTO ai_messages (conversation_id, sender, content, tamil_translation, corrections_json)
       VALUES (?, 'assistant', ?, ?, ?)`,
      [
        convId,
        aiResponse.reply,
        aiResponse.tamilTranslation || null,
        aiResponse.correction ? JSON.stringify(aiResponse.correction) : null
      ]
    );

    // Award minor XP (5 XP per interaction)
    await analyticsService.recordActivity({
      userId,
      xpEarned: 5,
      durationSeconds: 30,
      sessionType: 'chat',
      targetId: String(convId)
    });

    return success(res, {
      conversationId: convId,
      reply: aiResponse.reply,
      tamilTranslation: aiResponse.tamilTranslation,
      correction: aiResponse.correction,
      suggestedReplies: aiResponse.suggestedReplies || []
    });
  } catch (err) {
    next(err);
  }
}

async function correctSentence(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { sentence } = req.body;

    if (!sentence || sentence.trim().length === 0) {
      return error(res, 'Sentence is required for correction.', 400);
    }

    let userLevel = 'A1';
    if (userId) {
      const p = await db.query('SELECT current_level FROM user_profiles WHERE user_id = ?', [userId]);
      userLevel = p[0]?.current_level || 'A1';
    }

    const result = await aiService.correctSentence(sentence.trim(), userLevel);

    // If there is a mistake, log in mistake notebook
    if (userId && result.hasMistake) {
      await db.execute(
        `INSERT INTO mistake_logs (user_id, source_type, original_input, corrected_input, explanation, tamil_explanation, grammar_rule)
         VALUES (?, 'doctor', ?, ?, ?, ?, ?)`,
        [userId, result.original, result.improved, result.explanation, result.tamilExplanation, result.grammarRule]
      );
    }

    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function evaluateWriting(req, res, next) {
  try {
    const userId = req.user.id;
    const { promptId, promptTitle, text, minWords = 30 } = req.body;

    if (!text || text.trim().length === 0) {
      return error(res, 'Text content is required for evaluation.', 400);
    }

    const profile = await db.query('SELECT current_level FROM user_profiles WHERE user_id = ?', [userId]);
    const userLevel = profile[0]?.current_level || 'A1';

    const evaluation = await aiService.evaluateWriting({
      promptTitle: promptTitle || 'Writing Practice',
      studentText: text.trim(),
      minWords,
      level: userLevel
    });

    const xpEarned = Math.round(Math.max(15, evaluation.overallScore * 0.4));

    const activity = await analyticsService.recordActivity({
      userId,
      xpEarned,
      durationSeconds: 120,
      sessionType: 'writing',
      targetId: promptId || 'custom_writing'
    });

    return success(res, {
      ...evaluation,
      xpAwarded: xpEarned,
      currentStreak: activity.currentStreak,
      newAchievements: activity.newlyUnlocked
    });
  } catch (err) {
    next(err);
  }
}

async function getScenarios(req, res, next) {
  try {
    const scenarios = await db.query('SELECT * FROM conversation_topics ORDER BY order_index ASC');
    return success(res, scenarios);
  } catch (err) {
    next(err);
  }
}

async function getConversationHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conv = await db.query('SELECT * FROM ai_conversations WHERE id = ? AND user_id = ?', [id, userId]);
    if (conv.length === 0) {
      return error(res, 'Conversation not found', 404);
    }

    const messages = await db.query('SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY id ASC', [id]);
    return success(res, {
      conversation: conv[0],
      messages
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  chat,
  correctSentence,
  evaluateWriting,
  getScenarios,
  getConversationHistory
};
