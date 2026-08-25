const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

async function seedLessons() {
  const lessons = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/lessons.json'), 'utf8'));
  const contents = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/lesson_content.json'), 'utf8'));

  for (const l of lessons) {
    const existing = await db.query('SELECT id FROM lessons WHERE id = ?', [l.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO lessons (id, module_id, title, tamil_title, lesson_type, xp_reward, duration_minutes, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          l.id,
          l.module_id,
          l.title,
          l.tamil_title || '',
          l.lesson_type || 'standard',
          l.xp_reward || 50,
          l.duration_minutes || l.estimated_minutes || 15,
          l.order_index || 1
        ]
      );
    }
  }

  let contentCount = 0;
  for (const c of contents) {
    const existing = await db.query(
      'SELECT id FROM lesson_content WHERE lesson_id = ? AND title = ?',
      [c.lesson_id, c.title]
    );
    if (existing.length === 0) {
      const text = c.content_text || c.content || '';
      const tamil = c.tamil_translation || c.tamil_content || '';
      await db.execute(
        `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, phonetic_guide, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [c.lesson_id, c.section_type, c.title, text, tamil, c.phonetic_guide || '', c.order_index || 1]
      );
      contentCount++;
    }
  }

  return {
    lessons: lessons.length,
    lessonContent: contentCount
  };
}

module.exports = seedLessons;
