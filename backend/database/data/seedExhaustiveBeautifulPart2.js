/**
 * SEED EXHAUSTIVE EXTRACTED PART-II DATA (QUESTIONS 21 TO 30)
 * Directly extracted from Way to Success +1 English PDF (Pages 45 to 60)
 * Run: node backend/database/data/seedExhaustiveBeautifulPart2.js
 */

const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

async function seedPart2() {
  await db.initMySQL();
  
  // Wipe just Part 2 data to prevent duplicates (if running repeatedly)
  await db.execute("DELETE FROM lesson_content WHERE lesson_id IN ('lsn_wts_p2_poem_erc', 'lsn_wts_p2_grammar')");
  await db.execute("DELETE FROM lessons WHERE module_id = 'mod_wts_part2'");
  await db.execute("DELETE FROM modules WHERE id = 'mod_wts_part2'");

  // 1. Create Module
  await db.execute(`
    INSERT INTO modules (id, course_id, title, tamil_title, description, order_index)
    VALUES ('mod_wts_part2', 'crs_class11', 'Part II: Poetry & Grammar', 'பகுதி 2: கவிதை மற்றும் இலக்கணம்', 'Appreciation Questions and Grammar Topics', 2)
  `);

  // 2. Create Lessons
  await db.execute(`
    INSERT INTO lessons (id, module_id, title, tamil_title, lesson_type, xp_reward, duration_minutes, order_index, is_published)
    VALUES ('lsn_wts_p2_poem_erc', 'mod_wts_part2', '21-26. Poem Appreciation Questions', 'கவிதை வினாக்கள்', 'standard', 30, 20, 1, 1)
  `);
  
  await db.execute(`
    INSERT INTO lessons (id, module_id, title, tamil_title, lesson_type, xp_reward, duration_minutes, order_index, is_published)
    VALUES ('lsn_wts_p2_grammar', 'mod_wts_part2', '27-30. Grammar (Speech, Voice, Sentences, Conditionals)', 'இலக்கணம்', 'standard', 30, 25, 2, 1)
  `);

  // Load dynamically generated Markdown from parser
  const dataPath = path.join(__dirname, 'part2_content.json');
  const parsedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  await db.execute(
    'INSERT INTO lesson_content (id, lesson_id, section_type, title, content_text, order_index) VALUES (?, ?, ?, ?, ?, ?)',
    [901, 'lsn_wts_p2_poem_erc', 'concept', 'Poetry Appreciation', parsedData.poetry, 1]
  );
  
  await db.execute(
    'INSERT INTO lesson_content (id, lesson_id, section_type, title, content_text, order_index) VALUES (?, ?, ?, ?, ?, ?)',
    [902, 'lsn_wts_p2_grammar', 'concept', 'Grammar Section', parsedData.grammar, 1]
  );

  console.log('🎉 Part-II Successfully Seeded!');
  process.exit(0);
}

seedPart2().catch(e => { console.error(e); process.exit(1); });
