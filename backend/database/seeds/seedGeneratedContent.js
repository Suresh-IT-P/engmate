const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

/**
 * Seed the generated vocabulary and grammar packs.
 *
 * Reads the validated JSON written by database/data/generated/, which has
 * already been through validateGeneratedContent.js. Idempotent: every row is
 * checked before insert, so this can run on every boot and repairs a partial
 * load rather than skipping it.
 */

const GENERATED = path.resolve(__dirname, '../data/generated');

function readPack(name) {
  const file = path.join(GENERATED, name);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.warn(`[GeneratedContent] ${name} is unreadable: ${err.message}`);
    return null;
  }
}

/** Category ids referenced by the packs must exist or the FK rejects the row. */
async function knownCategories() {
  const rows = await db.query('SELECT id FROM content_categories');
  return new Set(rows.map((r) => r.id));
}

async function seedVocabularyPack() {
  const pack = readPack('vocabulary_generated.json');
  if (!pack || !Array.isArray(pack.entries)) return { words: 0, examples: 0, skipped: 0 };

  const categories = await knownCategories();

  // One read instead of one query per word — the pack is thousands of rows and
  // a per-row SELECT over a remote database would take many minutes.
  const existing = new Set(
    (await db.query('SELECT LOWER(word) AS w FROM vocabulary')).map((r) => r.w)
  );

  let words = 0;
  let examples = 0;
  let skipped = 0;

  for (const e of pack.entries) {
    const key = e.word.toLowerCase();
    if (existing.has(key)) { skipped++; continue; }

    const category = categories.has(e.category_id) ? e.category_id : 'general';

    try {
      const res = await db.execute(
        `INSERT INTO vocabulary
           (word, phonetic, part_of_speech, meaning, simple_meaning, tamil_meaning,
            level_id, category_id, synonyms, antonyms, related_words, common_mistakes, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        [e.word, e.phonetic || null, e.part_of_speech, e.meaning, e.simple_meaning,
          e.tamil_meaning, e.level_id, category, e.synonyms || null, e.antonyms || null,
          e.related_words || null, e.common_mistakes || null]
      );
      existing.add(key);
      words++;

      if (e.example && e.example.sentence) {
        await db.execute(
          `INSERT INTO vocabulary_examples (vocabulary_id, sentence, tamil_translation)
           VALUES (?, ?, ?)`,
          [res.insertId, e.example.sentence, e.example.tamil_translation]
        );
        examples++;
      }
    } catch (err) {
      // A duplicate means another process got there first; anything else is
      // worth knowing about but must not stop the rest of the pack.
      if (!/Duplicate|UNIQUE/i.test(err.message)) {
        console.warn(`[GeneratedContent] "${e.word}" failed: ${err.message}`);
      }
      skipped++;
    }
  }

  return { words, examples, skipped };
}

async function seedGrammarPack() {
  const pack = readPack('grammar_generated.json');
  if (!pack || !Array.isArray(pack.topics)) return { topics: 0, examples: 0, skipped: 0 };

  const categories = await knownCategories();
  const grammarCategory = categories.has('grammar') ? 'grammar' : 'general';

  const existingTopics = new Set(
    (await db.query('SELECT id FROM grammar_topics')).map((r) => r.id)
  );

  let topics = 0;
  let examples = 0;
  let skipped = 0;

  let order = 100; // keep generated topics after the hand-written ones
  for (const t of pack.topics) {
    order++;

    if (!existingTopics.has(t.id)) {
      try {
        await db.execute(
          `INSERT INTO grammar_topics
             (id, title, tamil_title, level_id, category_id, summary, tamil_summary,
              rule_formula, explanation, beginner_explanation, common_mistakes, order_index)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [t.id, t.title, t.tamil_title, t.level_id, grammarCategory, t.summary || null,
            t.tamil_summary || null, t.rule_formula || null, t.explanation,
            t.beginner_explanation || null, t.common_mistakes || null, order]
        );
        existingTopics.add(t.id);
        topics++;
      } catch (err) {
        if (!/Duplicate|UNIQUE/i.test(err.message)) {
          console.warn(`[GeneratedContent] topic ${t.id} failed: ${err.message}`);
        }
        skipped++;
        continue;
      }
    }

    // Examples are keyed on (topic, sentence) so a re-run tops up rather than
    // duplicating what is already there.
    const seen = new Set(
      (await db.query('SELECT example_sentence FROM grammar_examples WHERE grammar_id = ?', [t.id]))
        .map((r) => String(r.example_sentence).trim().toLowerCase())
    );

    let idx = 0;
    for (const ex of t.examples || []) {
      idx++;
      const key = ex.example_sentence.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      try {
        await db.execute(
          `INSERT INTO grammar_examples
             (grammar_id, example_sentence, tamil_translation, is_correct, explanation, order_index)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [t.id, ex.example_sentence, ex.tamil_translation, ex.is_correct, ex.explanation || null, idx]
        );
        examples++;
      } catch (err) {
        if (!/Duplicate|UNIQUE/i.test(err.message)) {
          console.warn(`[GeneratedContent] example under ${t.id} failed: ${err.message}`);
        }
        skipped++;
      }
    }
  }

  return { topics, examples, skipped };
}

async function seedGeneratedContent() {
  const vocab = await seedVocabularyPack();
  const grammar = await seedGrammarPack();

  if (vocab.words || vocab.examples) {
    console.log(`[GeneratedContent] vocabulary +${vocab.words} words, +${vocab.examples} examples`);
  }
  if (grammar.topics || grammar.examples) {
    console.log(`[GeneratedContent] grammar +${grammar.topics} topics, +${grammar.examples} examples`);
  }

  return { vocab, grammar };
}

module.exports = seedGeneratedContent;

if (require.main === module) {
  (async () => {
    await db.initMySQL();
    const r = await seedGeneratedContent();
    console.log(JSON.stringify(r, null, 1));
    process.exit(0);
  })().catch((err) => {
    console.error('❌ seedGeneratedContent failed:', err.message);
    process.exit(1);
  });
}
