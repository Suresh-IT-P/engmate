/**
 * SEED EXHAUSTIVE EXTRACTED PART-III DATA (QUESTIONS 31 TO 40)
 * Run: node backend/database/data/seedExhaustiveBeautifulPart3.js
 */

const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

async function seedPart3() {
  await db.initMySQL();
  
  // Wipe just Part 3 data to prevent duplicates (if running repeatedly)
  await db.execute("DELETE FROM lesson_content WHERE lesson_id IN ('lsn_wts_p3_poem_erc', 'lsn_wts_p3_prose_short', 'lsn_wts_p3_grammar_3m')");
  await db.execute("DELETE FROM lessons WHERE module_id = 'mod_wts_part3'");
  await db.execute("DELETE FROM modules WHERE id = 'mod_wts_part3'");

  // 1. Create Module
  await db.execute(`
    INSERT INTO modules (id, course_id, title, tamil_title, description, order_index)
    VALUES ('mod_wts_part3', 'crs_class11', 'Part III: Short Answers & 3-Mark Grammar', 'பகுதி 3: குறுவினாக்கள் மற்றும் இலக்கணம்', 'Poem ERC, Prose Short Answers, and Extensive Testing Topics', 3)
  `);

  // 2. Create Lessons
  await db.execute(`
    INSERT INTO lessons (id, module_id, title, tamil_title, lesson_type, xp_reward, duration_minutes, order_index)
    VALUES ('lsn_wts_p3_poem_erc', 'mod_wts_part3', '31-33. Poem ERC', 'கவிதை விளக்கங்கள்', 'standard', 30, 20, 1)
  `);
  
  await db.execute(`
    INSERT INTO lessons (id, module_id, title, tamil_title, lesson_type, xp_reward, duration_minutes, order_index)
    VALUES ('lsn_wts_p3_prose_short', 'mod_wts_part3', '34-36. Prose Short Answers', 'உரைநடை குறுவினாக்கள்', 'standard', 30, 20, 2)
  `);

  await db.execute(`
    INSERT INTO lessons (id, module_id, title, tamil_title, lesson_type, xp_reward, duration_minutes, order_index)
    VALUES ('lsn_wts_p3_grammar_3m', 'mod_wts_part3', '37-40. Testing Topics (3-Mark)', 'இலக்கண வினாக்கள்', 'standard', 50, 45, 3)
  `);

  // Load dynamically generated Markdown from parser
  const dataPath = path.join(__dirname, 'part3_content.json');
  const parsedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  await db.execute(
    'INSERT INTO lesson_content (id, lesson_id, section_type, title, content_text, order_index) VALUES (?, ?, ?, ?, ?, ?)',
    [903, 'lsn_wts_p3_poem_erc', 'concept', 'Poem ERC (Context & Explanation)', parsedData.lesson_poem_erc, 1]
  );
  
  await db.execute(
    'INSERT INTO lesson_content (id, lesson_id, section_type, title, content_text, order_index) VALUES (?, ?, ?, ?, ?, ?)',
    [904, 'lsn_wts_p3_prose_short', 'concept', 'Prose Short Answers', parsedData.lesson_prose_short, 1]
  );
  
  await db.execute(
    'INSERT INTO lesson_content (id, lesson_id, section_type, title, content_text, order_index) VALUES (?, ?, ?, ?, ?, ?)',
    [905, 'lsn_wts_p3_grammar_3m', 'concept', '3-Mark Grammar & Writing Topics', parsedData.lesson_grammar_3m, 1]
  );

  console.log('🎉 Part-III Successfully Seeded!');
  process.exit(0);
}

seedPart3().catch(e => { console.error(e); process.exit(1); });
