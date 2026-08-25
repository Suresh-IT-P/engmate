/**
 * PURGE ALL NON-11TH COURSES & DATA
 * Leaves ONLY Class 11 English (Samacheer Kalvi & Way to Success PDF Data)
 * Run: node backend/database/data/purgeAllExcept11th.js
 */

const db = require('../../src/config/db');
const runMigration = require('../migrations/migrate');

async function purgeAllExcept11th() {
  console.log('🧹 Purging all non-11th courses from database...');
  await runMigration();

  // Delete all courses except crs_class11 and course_samacheer_class_11
  await db.execute(`DELETE FROM courses WHERE id NOT IN ('crs_class11', 'course_samacheer_class_11')`);

  // Ensure course_samacheer_class_11 also redirects or exists cleanly
  await db.execute(
    `INSERT OR IGNORE INTO courses (id, level_id, title, tamil_title, description, is_published, order_index)
     VALUES ('course_samacheer_class_11', 'B1', 'Class 11 English (Samacheer Kalvi)', '11ஆம் வகுப்பு ஆங்கிலம் (சமச்சீர்)', 'Complete Class 11 English Syllabus', 1, 1)`
  );

  await db.execute(
    `INSERT OR IGNORE INTO courses (id, level_id, title, tamil_title, description, is_published, order_index)
     VALUES ('crs_class11', 'B1', 'Class 11 English (Samacheer Kalvi)', '11ஆம் வகுப்பு ஆங்கிலம் (சமச்சீர்)', 'Complete Class 11 English Syllabus', 1, 1)`
  );

  console.log('✅ Wiped non-11th courses. Only Class 11 remains active in database!');
}

if (require.main === module) {
  purgeAllExcept11th()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = purgeAllExcept11th;
