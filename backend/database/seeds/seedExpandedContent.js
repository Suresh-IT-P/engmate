/**
 * Seeds the expanded Class 11 learning content:
 *   - grammar topics and their examples      (grammar_expanded.json)
 *   - practice exercises, questions, options (built from the WTS guide)
 *   - reading passages                       (reading_expanded.json)
 *   - writing prompts                        (writing_expanded.json)
 *   - AI roleplay scenarios                  (conversations_expanded.json)
 *
 * Idempotent: every row is checked before insert, so running it twice adds
 * nothing and never disturbs user progress.
 */

const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');
const { build: buildExercises } = require('../data/buildWtsExercises');

const dataFile = (name) => JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data', name), 'utf8'));

async function exists(sql, params) {
  const rows = await db.query(sql, params);
  return rows.length > 0;
}

async function seedGrammar(stats) {
  for (const t of dataFile('grammar_expanded.json')) {
    if (!(await exists('SELECT id FROM grammar_topics WHERE id = ?', [t.id]))) {
      await db.execute(
        `INSERT INTO grammar_topics
           (id, title, tamil_title, level_id, category_id, summary, tamil_summary,
            rule_formula, explanation, beginner_explanation, common_mistakes, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.id, t.title, t.tamil_title, t.level_id, t.category_id, t.summary, t.tamil_summary,
          t.rule_formula, t.explanation, t.beginner_explanation, t.common_mistakes, t.order_index]
      );
      stats.grammar++;
    }

    for (const [i, ex] of (t.examples || []).entries()) {
      if (await exists('SELECT id FROM grammar_examples WHERE grammar_id = ? AND example_sentence = ?', [t.id, ex.sentence])) continue;
      await db.execute(
        `INSERT INTO grammar_examples
           (grammar_id, example_sentence, tamil_translation, is_correct, explanation, order_index)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [t.id, ex.sentence, ex.tamil_translation, ex.is_correct ? 1 : 0, ex.explanation, i + 1]
      );
      stats.grammarExamples++;
    }
  }
}

async function seedExercises(stats) {
  for (const ex of buildExercises()) {
    if (!(await exists('SELECT id FROM exercises WHERE id = ?', [ex.id]))) {
      await db.execute(
        `INSERT INTO exercises
           (id, lesson_id, grammar_id, category_id, level_id, title, exercise_type,
            instructions, tamil_instructions, xp_points, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ex.id, ex.lesson_id, ex.grammar_id, ex.category_id, ex.level_id, ex.title,
          ex.exercise_type, ex.instructions, ex.tamil_instructions, ex.xp_points, ex.order_index]
      );
      stats.exercises++;
    }

    for (const q of ex.questions) {
      // Keyed on order_index, not question_text: error-spotting questions all
      // share one stem, and matching on text would collapse them into a single
      // row with every option piled onto it.
      const found = await db.query(
        'SELECT id FROM questions WHERE exercise_id = ? AND order_index = ?',
        [ex.id, q.order_index]
      );
      let questionId;
      if (found.length) {
        questionId = found[0].id;
      } else {
        const res = await db.execute(
          `INSERT INTO questions
             (exercise_id, question_text, tamil_subtext, correct_answer, explanation,
              tamil_explanation, hint, points, order_index)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [ex.id, q.question_text, q.tamil_subtext, q.correct_answer, q.explanation,
            q.tamil_explanation, q.hint, q.points, q.order_index]
        );
        questionId = res.insertId;
        stats.questions++;
      }

      for (const [i, opt] of q.options.entries()) {
        if (await exists('SELECT id FROM question_options WHERE question_id = ? AND option_text = ?', [questionId, opt.option_text])) continue;
        await db.execute(
          `INSERT INTO question_options (question_id, option_text, tamil_text, is_correct, order_index)
           VALUES (?, ?, ?, ?, ?)`,
          [questionId, opt.option_text, null, opt.is_correct, i + 1]
        );
        stats.options++;
      }
    }
  }
}

async function seedReading(stats) {
  for (const p of dataFile('reading_expanded.json')) {
    if (await exists('SELECT id FROM reading_passages WHERE id = ?', [p.id])) continue;
    await db.execute(
      `INSERT INTO reading_passages
         (id, title, tamil_title, passage_text, level_id, word_count, vocabulary_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.title, p.tamil_title, p.passage_text, p.level_id, p.word_count, p.vocabulary_notes]
    );
    stats.reading++;
  }
}

async function seedWriting(stats) {
  for (const w of dataFile('writing_expanded.json')) {
    if (await exists('SELECT id FROM writing_prompts WHERE id = ?', [w.id])) continue;
    await db.execute(
      `INSERT INTO writing_prompts
         (id, title, tamil_title, prompt_type, instructions, sample_answer, level_id, min_words)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [w.id, w.title, w.tamil_title, w.prompt_type, w.instructions, w.sample_answer, w.level_id, w.min_words]
    );
    stats.writing++;
  }
}

async function seedConversations(stats) {
  for (const c of dataFile('conversations_expanded.json')) {
    if (await exists('SELECT id FROM conversation_topics WHERE id = ?', [c.id])) continue;
    await db.execute(
      `INSERT INTO conversation_topics
         (id, title, tamil_title, persona_name, persona_role, scenario_description,
          initial_message, tamil_initial_message, level_id, category, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.title, c.tamil_title, c.persona_name, c.persona_role, c.scenario_description,
        c.initial_message, c.tamil_initial_message, c.level_id, c.category, c.order_index]
    );
    stats.conversations++;
  }
}

async function seedExpandedContent() {
  const stats = {
    grammar: 0, grammarExamples: 0, exercises: 0, questions: 0, options: 0,
    reading: 0, writing: 0, conversations: 0
  };

  console.log('Seeding expanded Class 11 content...');
  await seedGrammar(stats);
  console.log(`  grammar topics    +${stats.grammar} (examples +${stats.grammarExamples})`);
  await seedExercises(stats);
  console.log(`  exercises         +${stats.exercises} (questions +${stats.questions}, options +${stats.options})`);
  await seedReading(stats);
  console.log(`  reading passages  +${stats.reading}`);
  await seedWriting(stats);
  console.log(`  writing prompts   +${stats.writing}`);
  await seedConversations(stats);
  console.log(`  roleplay scenarios +${stats.conversations}`);

  db.persistSQLite();
  return stats;
}

module.exports = seedExpandedContent;

if (require.main === module) {
  seedExpandedContent()
    .then(() => { console.log('Done.'); process.exit(0); })
    .catch((err) => { console.error('Seeding failed:', err); process.exit(1); });
}
