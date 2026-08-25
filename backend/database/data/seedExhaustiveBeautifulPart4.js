/**
 * SEED EXHAUSTIVE EXTRACTED PART-IV DATA (QUESTIONS 41 TO 47)
 * Run: node backend/database/data/seedExhaustiveBeautifulPart4.js
 */

const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

async function seedPart4() {
  await db.initMySQL();
  
  // Wipe just Part 4 data to prevent duplicates (if running repeatedly)
  await db.execute("DELETE FROM lesson_content WHERE lesson_id IN ('lsn_wts_p4_paragraphs', 'lsn_wts_p4_note_making', 'lsn_wts_p4_writing')");
  await db.execute("DELETE FROM lessons WHERE module_id = 'mod_wts_part4'");
  await db.execute("DELETE FROM modules WHERE id = 'mod_wts_part4'");

  // 1. Create Module
  await db.execute(`
    INSERT INTO modules (id, course_id, title, tamil_title, description, order_index)
    VALUES ('mod_wts_part4', 'crs_class11', 'Part IV: Long Answers & Comprehension', 'பகுதி 4: பெருவினாக்கள்', 'Detailed Paragraph Essays, Note-Making, Reading Comprehension, and Letter Writing', 4)
  `);

  // 2. Create Lessons
  await db.execute(`
    INSERT INTO lessons (id, module_id, title, tamil_title, lesson_type, xp_reward, duration_minutes, order_index)
    VALUES ('lsn_wts_p4_paragraphs', 'mod_wts_part4', '41-43. Paragraph Answers', 'பத்தி வினாக்கள்', 'standard', 40, 30, 1)
  `);
  
  await db.execute(`
    INSERT INTO lessons (id, module_id, title, tamil_title, lesson_type, xp_reward, duration_minutes, order_index)
    VALUES ('lsn_wts_p4_note_making', 'mod_wts_part4', '44-45. Note-Making & Comprehension', 'குறிப்பு வரைதல்', 'standard', 40, 30, 2)
  `);

  await db.execute(`
    INSERT INTO lessons (id, module_id, title, tamil_title, lesson_type, xp_reward, duration_minutes, order_index)
    VALUES ('lsn_wts_p4_writing', 'mod_wts_part4', '46-47. Letter Writing & Topics', 'கடிதம் வரைதல்', 'standard', 40, 30, 3)
  `);

  // Load dynamically generated Markdown from parser
  const dataPath = path.join(__dirname, 'new_part4_content.json');
  const parsedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  await db.execute(
    'INSERT INTO lesson_content (id, lesson_id, section_type, title, content_text, order_index) VALUES (?, ?, ?, ?, ?, ?)',
    [906, 'lsn_wts_p4_paragraphs', 'concept', 'Paragraph Questions (Prose & Poem)', parsedData.lesson_paragraphs, 1]
  );
  
  await db.execute(
    'INSERT INTO lesson_content (id, lesson_id, section_type, title, content_text, order_index) VALUES (?, ?, ?, ?, ?, ?)',
    [907, 'lsn_wts_p4_note_making', 'concept', 'Note Making & Summarization', parsedData.lesson_note_making, 1]
  );
  
  await db.execute(
    'INSERT INTO lesson_content (id, lesson_id, section_type, title, content_text, order_index) VALUES (?, ?, ?, ?, ?, ?)',
    [908, 'lsn_wts_p4_writing', 'concept', 'Creative Writing & Letters', parsedData.lesson_writing, 1]
  );

  console.log('🎉 Part-IV Successfully Seeded! All guide data has been processed.');
  process.exit(0);
}

seedPart4().catch(e => { console.error(e); process.exit(1); });
