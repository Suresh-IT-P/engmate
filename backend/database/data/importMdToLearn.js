const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');
const runMigration = require('../migrations/migrate');

async function importCompleteMarkdown() {
  console.log('🚀 Starting ingestion of complete 11th English Markdown...');
  await runMigration();

  const mdFilePath = path.join(__dirname, '../../../../namma_kalvi_-_11th_wts_english_guide_2019.md');
  const mdContent = fs.readFileSync(mdFilePath, 'utf8');
  const lines = mdContent.split('\n');
  
  console.log(`Read ${lines.length} lines from markdown file.`);

  // Find boundaries
  let part1Start = -1, part2Start = -1, part3Start = -1, part4Start = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('PART - I : 20 MARKS') || line.includes('### <mark>Part - I</mark>')) {
      if (part1Start === -1) part1Start = i;
    }
    if (line.includes('# PART - II') || line.includes('###### **<mark>PART - II</mark>**')) {
      if (part2Start === -1) part2Start = i;
    }
    if (line.includes('# PART - III') || line.includes('#### **<mark>QN NO PART - III 31 - 40</mark>**')) {
      if (part3Start === -1) part3Start = i;
    }
    if (line.includes('# PART - IV') || line.includes('## **<mark>PART - IV Qn.PAPER CONTENTS</mark>**')) {
      if (part4Start === -1) part4Start = i;
    }
  }

  // Fallback boundaries if exact strings missed
  if (part1Start === -1) part1Start = 100;
  if (part2Start === -1) part2Start = 2350;
  if (part3Start === -1) part3Start = 4410;
  if (part4Start === -1) part4Start = 7030;

  console.log(`Boundaries detected -> Part I: ${part1Start}, Part II: ${part2Start}, Part III: ${part3Start}, Part IV: ${part4Start}`);

  const parts = [
    { id: 'part1', title: 'Part I', lines: lines.slice(part1Start, part2Start) },
    { id: 'part2', title: 'Part II', lines: lines.slice(part2Start, part3Start) },
    { id: 'part3', title: 'Part III', lines: lines.slice(part3Start, part4Start) },
    { id: 'part4', title: 'Part IV', lines: lines.slice(part4Start) }
  ];

  // 1. Insert New Course
  const courseId = 'crs_class11_raw';
  await db.execute(
    `INSERT IGNORE INTO courses (id, level_id, title, tamil_title, description, is_published, order_index)
     VALUES (?, 'B1', ?, ?, ?, 1, 2)`,
    [courseId, 'Class 11 English (Complete Raw Guide)', '11ஆம் வகுப்பு ஆங்கிலம் (முழு வழிகாட்டி)', 'The complete, unedited contents of the 11th standard English guide.']
  );
  
  // Clean up any old modules/lessons for this course just in case
  await db.execute(`DELETE FROM modules WHERE course_id = ?`, [courseId]);

  // 2. Insert Modules and Lessons
  let moduleOrder = 1;
  const chunkLines = 300;

  for (const part of parts) {
    const moduleId = `mod_raw_${part.id}`;
    await db.execute(
      `INSERT INTO modules (id, course_id, title, description, order_index)
       VALUES (?, ?, ?, ?, ?)`,
      [moduleId, courseId, `Complete ${part.title}`, `Raw extracted text for ${part.title}`, moduleOrder]
    );

    let lessonOrder = 1;
    for (let i = 0; i < part.lines.length; i += chunkLines) {
      const chunk = part.lines.slice(i, i + chunkLines);
      const lessonId = `lsn_raw_${part.id}_${lessonOrder}`;
      
      const title = `${part.title} - Section ${lessonOrder} (Lines ${i} to ${Math.min(i + chunkLines, part.lines.length)})`;

      await db.execute(
        `INSERT INTO lessons (id, module_id, title, lesson_type, order_index, is_published)
         VALUES (?, ?, ?, 'reading', ?, 1)`,
        [lessonId, moduleId, title, lessonOrder]
      );

      // We wrap the chunk in a markdown block or just output as is, we can format as markdown
      let contentText = chunk.join('\n');
      // Adding a simple wrapper so it looks okay
      contentText = `### ${title}\n\n${contentText}`;

      await db.execute(
        `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, order_index)
         VALUES (?, 'concept', ?, ?, 1)`,
        [lessonId, title, contentText]
      );

      lessonOrder++;
    }
    console.log(`Inserted module ${part.title} with ${lessonOrder - 1} lessons.`);
    moduleOrder++;
  }

  console.log('✅ Successfully seeded complete raw data into database!');
}

importCompleteMarkdown().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error('❌ Error during ingestion:', err);
  process.exit(1);
});
