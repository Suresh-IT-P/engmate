const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

async function seedCourses() {
  const levels = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/levels.json'), 'utf8'));
  const categories = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/categories.json'), 'utf8'));
  const courses = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/courses.json'), 'utf8'));
  const modules = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/modules.json'), 'utf8'));

  // 1. Seed Levels
  for (const lvl of levels) {
    const existing = await db.query('SELECT id FROM learning_levels WHERE id = ?', [lvl.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO learning_levels (id, name, title, description, order_index, min_xp, badge_icon)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [lvl.id, lvl.name, lvl.title, lvl.description, lvl.order_index, lvl.min_xp, lvl.badge_icon]
      );
    }
  }

  // 2. Seed Categories
  for (const cat of categories) {
    const existing = await db.query('SELECT id FROM content_categories WHERE id = ?', [cat.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO content_categories (id, name, tamil_name, description, icon, color_code, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [cat.id, cat.name, cat.tamil_name, cat.description, cat.icon, cat.color_code, cat.order_index]
      );
    }
  }

  // 3. Seed Courses
  for (const c of courses) {
    const existing = await db.query('SELECT id FROM courses WHERE id = ?', [c.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO courses (id, title, tamil_title, description, tamil_description, level_id, category_id, total_xp, estimated_hours, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.title, c.tamil_title, c.description, c.tamil_description, c.level_id, c.category_id, c.total_xp, c.estimated_hours, c.order_index]
      );
    }
  }

  // 4. Seed Modules
  for (const m of modules) {
    const existing = await db.query('SELECT id FROM modules WHERE id = ?', [m.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO modules (id, course_id, title, tamil_title, description, order_index)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [m.id, m.course_id, m.title, m.tamil_title, m.description, m.order_index]
      );
    }
  }

  return {
    levels: levels.length,
    categories: categories.length,
    courses: courses.length,
    modules: modules.length
  };
}

module.exports = seedCourses;
