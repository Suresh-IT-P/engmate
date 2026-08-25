const db = require('../config/db');
const { success, error } = require('../utils/response');

async function getAdminStats(req, res, next) {
  try {
    const userCount = (await db.query('SELECT COUNT(*) as c FROM users'))[0]?.c || 0;
    const courseCount = (await db.query('SELECT COUNT(*) as c FROM courses'))[0]?.c || 0;
    const lessonCount = (await db.query('SELECT COUNT(*) as c FROM lessons'))[0]?.c || 0;
    const vocabCount = (await db.query('SELECT COUNT(*) as c FROM vocabulary'))[0]?.c || 0;
    const grammarCount = (await db.query('SELECT COUNT(*) as c FROM grammar_topics'))[0]?.c || 0;
    const exerciseCount = (await db.query('SELECT COUNT(*) as c FROM exercises'))[0]?.c || 0;
    const quizAttemptsCount = (await db.query('SELECT COUNT(*) as c FROM quiz_attempts'))[0]?.c || 0;
    const activeLearnersToday = (await db.query('SELECT COUNT(DISTINCT user_id) as c FROM learning_sessions WHERE session_date = CURDATE()'))[0]?.c || 0;

    const recentUsers = await db.query(
      `SELECT u.id, u.email, u.role, u.status, u.created_at, p.full_name, p.current_level, p.xp
       FROM users u
       LEFT JOIN user_profiles p ON u.id = p.user_id
       ORDER BY u.created_at DESC
       LIMIT 10`
    );

    return success(res, {
      totals: {
        users: userCount,
        courses: courseCount,
        lessons: lessonCount,
        vocabulary: vocabCount,
        grammar: grammarCount,
        exercises: exerciseCount,
        quizAttempts: quizAttemptsCount,
        activeToday: activeLearnersToday
      },
      recentUsers
    });
  } catch (err) {
    next(err);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const { role, search, limit = 50, offset = 0 } = req.query;
    let sql = `SELECT u.id, u.email, u.role, u.status, u.created_at, p.full_name, p.current_level, p.target_level, p.xp, s.current_streak
               FROM users u
               LEFT JOIN user_profiles p ON u.id = p.user_id
               LEFT JOIN streaks s ON u.id = s.user_id
               WHERE 1=1`;
    const params = [];

    if (role) {
      sql += ' AND u.role = ?';
      params.push(role);
    }
    if (search) {
      sql += ' AND (u.email LIKE ? OR p.full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const users = await db.query(sql, params);
    return success(res, users);
  } catch (err) {
    next(err);
  }
}

async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    await db.execute(
      'UPDATE users SET role = COALESCE(?, role), status = COALESCE(?, status), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [role, status, id]
    );

    return success(res, { id, role, status }, 'User updated successfully.');
  } catch (err) {
    next(err);
  }
}

// -----------------------------------------------------------------
// BULK DATA IMPORT SYSTEM WITH VALIDATION & STATISTICS
// -----------------------------------------------------------------
async function importContent(req, res, next) {
  try {
    const { entityType, data } = req.body;

    if (!entityType || !Array.isArray(data)) {
      return error(res, 'Entity type and an array of records in "data" are required.', 400);
    }

    let validRecords = 0;
    let invalidRecords = 0;
    let duplicates = 0;
    let inserted = 0;
    let skipped = 0;
    const errorsList = [];

    if (entityType === 'vocabulary') {
      for (const item of data) {
        if (!item.word || !item.meaning || !item.tamil_meaning) {
          invalidRecords++;
          errorsList.push(`Word missing required fields: ${JSON.stringify(item)}`);
          continue;
        }
        validRecords++;

        const existing = await db.query('SELECT id FROM vocabulary WHERE word = ?', [item.word.trim().toLowerCase()]);
        if (existing.length > 0) {
          duplicates++;
          skipped++;
          continue;
        }

        const res = await db.execute(
          `INSERT INTO vocabulary (word, phonetic, part_of_speech, meaning, simple_meaning, tamil_meaning, level_id, category_id, synonyms, antonyms, related_words, common_mistakes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.word.trim().toLowerCase(),
            item.phonetic || '',
            item.part_of_speech || 'noun',
            item.meaning,
            item.simple_meaning || item.meaning,
            item.tamil_meaning,
            item.level_id || 'A1',
            item.category_id || 'vocabulary',
            item.synonyms || '',
            item.antonyms || '',
            item.related_words || '',
            item.common_mistakes || ''
          ]
        );

        if (item.example) {
          await db.execute(
            'INSERT INTO vocabulary_examples (vocabulary_id, sentence, tamil_translation) VALUES (?, ?, ?)',
            [res.insertId, item.example, item.tamil_example || '']
          );
        }

        inserted++;
      }
    } else if (entityType === 'grammar') {
      for (const item of data) {
        if (!item.id || !item.title || !item.explanation) {
          invalidRecords++;
          continue;
        }
        validRecords++;

        const existing = await db.query('SELECT id FROM grammar_topics WHERE id = ?', [item.id]);
        if (existing.length > 0) {
          duplicates++;
          skipped++;
          continue;
        }

        await db.execute(
          `INSERT INTO grammar_topics (id, title, tamil_title, level_id, category_id, summary, tamil_summary, rule_formula, explanation, beginner_explanation, common_mistakes, order_index)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id,
            item.title,
            item.tamil_title || item.title,
            item.level_id || 'A1',
            item.category_id || 'grammar',
            item.summary || '',
            item.tamil_summary || '',
            item.rule_formula || '',
            item.explanation,
            item.beginner_explanation || '',
            item.common_mistakes || '',
            item.order_index || 1
          ]
        );
        inserted++;
      }
    } else if (entityType === 'lessons') {
      for (const item of data) {
        if (!item.id || !item.module_id || !item.title) {
          invalidRecords++;
          continue;
        }
        validRecords++;

        const existing = await db.query('SELECT id FROM lessons WHERE id = ?', [item.id]);
        if (existing.length > 0) {
          duplicates++;
          skipped++;
          continue;
        }

        await db.execute(
          `INSERT INTO lessons (id, module_id, title, tamil_title, lesson_type, xp_reward, duration_minutes, order_index)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [item.id, item.module_id, item.title, item.tamil_title || '', item.lesson_type || 'standard', item.xp_reward || 25, item.duration_minutes || 10, item.order_index || 1]
        );
        inserted++;
      }
    } else {
      return error(res, `Unsupported entity type: ${entityType}`, 400);
    }

    return success(res, {
      entityType,
      validRecords,
      invalidRecords,
      duplicates,
      inserted,
      skipped,
      errors: errorsList.slice(0, 10)
    }, `Content import completed: ${inserted} inserted, ${skipped} skipped.`);
  } catch (err) {
    next(err);
  }
}

// -----------------------------------------------------------------
// CONTENT CMS CRUD
// -----------------------------------------------------------------
async function createVocabulary(req, res, next) {
  try {
    const { word, phonetic, part_of_speech, meaning, simple_meaning, tamil_meaning, level_id = 'A1', category_id = 'vocabulary', example, tamil_example } = req.body;
    if (!word || !meaning || !tamil_meaning) {
      return error(res, 'Word, English meaning, and Tamil meaning are required.', 400);
    }

    const resDb = await db.execute(
      `INSERT INTO vocabulary (word, phonetic, part_of_speech, meaning, simple_meaning, tamil_meaning, level_id, category_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [word.trim().toLowerCase(), phonetic, part_of_speech, meaning, simple_meaning, tamil_meaning, level_id, category_id]
    );

    if (example) {
      await db.execute(
        'INSERT INTO vocabulary_examples (vocabulary_id, sentence, tamil_translation) VALUES (?, ?, ?)',
        [resDb.insertId, example, tamil_example || '']
      );
    }

    return success(res, { id: resDb.insertId, word }, 'Vocabulary word created.', 201);
  } catch (err) {
    next(err);
  }
}

async function deleteVocabulary(req, res, next) {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM vocabulary WHERE id = ?', [id]);
    return success(res, { id }, 'Vocabulary word deleted.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  importContent,
  createVocabulary,
  deleteVocabulary
};
