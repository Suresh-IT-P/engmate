/**
 * Seeds the Grammar Battle topics and question bank.
 *
 * Idempotent via a per-question key. Unlike the other seeders this one does not
 * issue a SELECT per row — at five thousand questions that is eleven thousand
 * round trips — it loads the existing keys once and inserts only what is new.
 */

const crypto = require('crypto');
const db = require('../../src/config/db');
const { build } = require('../data/buildBattleQuestions');

const TOPIC_ICONS = {
  tenses: 'schedule',
  verb_forms: 'sync_alt',
  active_passive: 'swap_horiz',
  word_meanings: 'menu_book',
  find_the_word: 'search',
  vocab_context: 'article',
  prepositions: 'alt_route',
  articles: 'title',
  plurals: 'filter_2',
  degrees: 'trending_up',
  question_tags: 'help',
  concord: 'link',
  modals: 'gavel',
  clauses: 'account_tree',
  confusables: 'compare_arrows',
  affixes: 'add_circle',
  idioms: 'auto_awesome',
  synonyms: 'translate',
  spelling: 'spellcheck',
  figures: 'brush',
  sentence_patterns: 'dashboard',
  british_american: 'public',
  error_spotting: 'error'
};

/** Short stable identity for a question, so re-seeding never duplicates. */
const keyOf = (q) =>
  crypto.createHash('sha1')
    .update(`${q.q}|${q.options[q.ans]}`.toLowerCase().replace(/\s+/g, ' '))
    .digest('hex')
    .slice(0, 40);

async function seedBattleQuestions() {
  const topics = build();
  let topicCount = 0;
  let questionCount = 0;

  console.log('Seeding Grammar Battle bank...');

  for (const [index, t] of topics.entries()) {
    const existingTopic = await db.query('SELECT id FROM battle_topics WHERE id = ?', [t.topic]);
    if (existingTopic.length === 0) {
      await db.execute(
        `INSERT INTO battle_topics (id, title, tamil_title, icon, order_index)
         VALUES (?, ?, ?, ?, ?)`,
        [t.topic, t.title, t.tamil_title, TOPIC_ICONS[t.topic] || 'quiz', index + 1]
      );
      topicCount++;
    }

    // One read for the whole topic instead of one per question.
    const existingKeys = new Set(
      (await db.query('SELECT question_key FROM battle_questions WHERE topic_id = ?', [t.topic]))
        .map((r) => r.question_key)
    );

    let added = 0;
    for (const q of t.questions) {
      const key = keyOf(q);
      if (existingKeys.has(key)) continue;
      existingKeys.add(key);
      await db.execute(
        `INSERT INTO battle_questions
           (topic_id, question_text, option_a, option_b, option_c, option_d,
            answer_index, explanation, difficulty, question_key)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.topic, q.q, q.options[0], q.options[1], q.options[2], q.options[3],
          q.ans, q.explanation || null, q.difficulty || 'medium', key]
      );
      added++;
    }

    questionCount += added;
    console.log(`  ${t.title.padEnd(28)} +${String(added).padStart(4)}  (bank: ${t.questions.length})`);
  }

  db.persistSQLite();
  console.log(`\nTopics added: ${topicCount}, questions added: ${questionCount}`);
  return { topicCount, questionCount };
}

module.exports = seedBattleQuestions;

if (require.main === module) {
  seedBattleQuestions()
    .then(() => { console.log('Done.'); process.exit(0); })
    .catch((err) => { console.error('Battle seeding failed:', err); process.exit(1); });
}
