/**
 * CLEANUP OTHER SCHOOL STANDARDS FROM SQLITE DATABASE
 * Focus exclusively on Class 11 English (Samacheer Kalvi)
 * Run: node backend/database/data/cleanupOtherStandards.js
 */

const db = require('../../src/config/db');

async function cleanupOtherStandards() {
  console.log('🧹 Cleaning up other school standards (Classes 6, 7, 8, 9, 10, 12) to focus exclusively on Class 11...');

  const removeIds = [
    'course_samacheer_class_6',
    'course_samacheer_class_7',
    'course_samacheer_class_8',
    'course_samacheer_class_9',
    'course_samacheer_class_10',
    'course_samacheer_class_12',
    'course_tn_board_special'
  ];

  for (const id of removeIds) {
    await db.execute('DELETE FROM courses WHERE id = ?', [id]);
  }

  // Update Category name for tn_board
  await db.execute(
    `UPDATE content_categories 
     SET name = '11th Standard Syllabus', tamil_name = '11-ஆம் வகுப்பு பாடத்திட்டம்', description = '11th Standard Samacheer Kalvi English Curriculum'
     WHERE id = 'tn_board'`
  );

  console.log('✅ Successfully removed other school standards. Database is now focused on 11th Standard English!');
}

if (require.main === module) {
  cleanupOtherStandards()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = cleanupOtherStandards;
