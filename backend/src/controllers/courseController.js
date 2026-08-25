const db = require('../config/db');
const { success, error } = require('../utils/response');

async function getCourses(req, res, next) {
  try {
    const { level_id, category_id } = req.query;
    let sql = 'SELECT * FROM courses WHERE is_published = 1';
    const params = [];

    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }
    if (category_id) {
      sql += ' AND category_id = ?';
      params.push(category_id);
    }

    sql += ' ORDER BY order_index ASC';
    const courses = await db.query(sql, params);

    // If authenticated, attach progress percentage
    if (req.user) {
      for (const course of courses) {
        const modules = await db.query('SELECT id FROM modules WHERE course_id = ?', [course.id]);
        const moduleIds = modules.map(m => m.id);

        if (moduleIds.length > 0) {
          const placeholders = moduleIds.map(() => '?').join(',');
          const lessons = await db.query(`SELECT id FROM lessons WHERE module_id IN (${placeholders})`, moduleIds);
          const lessonIds = lessons.map(l => l.id);

          if (lessonIds.length > 0) {
            const lessonPlaceholders = lessonIds.map(() => '?').join(',');
            const completed = await db.query(
              `SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND lesson_id IN (${lessonPlaceholders})`,
              [req.user.id, ...lessonIds]
            );
            course.total_lessons = lessonIds.length;
            course.completed_lessons = completed[0]?.count || 0;
            course.progress_pct = Math.round((course.completed_lessons / course.total_lessons) * 100);
          } else {
            course.progress_pct = 0;
          }
        } else {
          course.progress_pct = 0;
        }
      }
    }

    return success(res, courses);
  } catch (err) {
    next(err);
  }
}

async function getCourseById(req, res, next) {
  try {
    let { id } = req.params;
    let courses = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
    if (courses.length === 0) {
      courses = await db.query("SELECT * FROM courses WHERE id = 'crs_class11'");
    }
    if (courses.length === 0) {
      courses = await db.query('SELECT * FROM courses LIMIT 1');
    }
    if (courses.length === 0) {
      return error(res, 'Course not found', 404);
    }

    const course = courses[0];
    const modules = await db.query('SELECT * FROM modules WHERE course_id = ? ORDER BY order_index ASC', [course.id]);

    for (const mod of modules) {
      const lessons = await db.query('SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index ASC', [mod.id]);
      if (req.user) {
        for (const les of lessons) {
          const prog = await db.query('SELECT status, score FROM user_progress WHERE user_id = ? AND lesson_id = ?', [req.user.id, les.id]);
          les.is_completed = prog.length > 0;
          les.score = prog[0]?.score || null;
        }
      }
      mod.lessons = lessons;
    }

    course.modules = modules;
    return success(res, course);
  } catch (err) {
    next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    const categories = await db.query('SELECT * FROM content_categories ORDER BY order_index ASC');
    return success(res, categories);
  } catch (err) {
    next(err);
  }
}

async function getLevels(req, res, next) {
  try {
    const levels = await db.query('SELECT * FROM learning_levels ORDER BY order_index ASC');
    return success(res, levels);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCourses,
  getCourseById,
  getCategories,
  getLevels
};
