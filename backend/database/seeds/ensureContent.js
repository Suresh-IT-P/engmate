const db = require('../../src/config/db');

/**
 * Bring an empty or partly-seeded deployment up to a fully populated app.
 *
 * The deploy path used to seed only the Class 11 dataset, and even that failed
 * because `learning_levels` was empty (see seedFoundations). Production ended
 * up with every content table at zero rows: no lessons, no grammar topics, no
 * battle questions, no chat rooms.
 *
 * Design note — why almost nothing here is gated on "is the table empty":
 * that gate is wrong for anything that takes a while. A seeder interrupted
 * part-way (a redeploy, a platform restart, one bad row) leaves the table
 * non-empty but incomplete, and an empty-only gate then skips it forever. That
 * is exactly how `vocabulary` got stuck at 2 rows after one bad foreign key.
 * Every seeder below checks each row before inserting it, so re-running is
 * cheap and repairs a partial state.
 *
 * Runs AFTER the HTTP server is listening: the first seed of the 5,384-question
 * battle bank takes minutes over a remote database, long enough to trip a
 * platform's start-up health check if it blocked the listen.
 */

async function countOf(table) {
  try {
    const r = await db.query(`SELECT COUNT(*) AS c FROM \`${table}\``);
    return Number(r[0]?.c || 0);
  } catch (_) {
    return -1; // table missing; the migration reports that separately
  }
}

/**
 * Run an idempotent seeder and report what it added. Never throws — one broken
 * area must not stop the rest of the app being populated.
 */
async function ensure(label, table, run) {
  const before = await countOf(table);
  if (before === -1) {
    console.warn(`[Content] ${label}: table "${table}" not found, skipping`);
    return { label, skipped: true };
  }

  const started = Date.now();
  try {
    await run();
    const after = await countOf(table);
    const took = ((Date.now() - started) / 1000).toFixed(1);
    if (after > before) {
      console.log(`[Content] ${label}: +${after - before} (now ${after}) in ${took}s`);
      return { label, added: after - before, total: after };
    }
    return { label, total: after };
  } catch (err) {
    console.error(`[Content] ${label} FAILED: ${err.message}`);
    return { label, error: err.message };
  }
}

/**
 * The one step that must stay gated on empty: it begins by DELETEing courses,
 * modules, lessons, questions, vocabulary and user_progress, so re-running it
 * against a live database would wipe learner progress.
 */
async function ensureClass11Dataset() {
  const courses = await countOf('courses');
  if (courses === -1) return { label: 'Class 11 dataset', skipped: true };
  if (courses > 0) return { label: 'Class 11 dataset', total: courses };

  const started = Date.now();
  try {
    const seedMasterPdfDataset = require('../data/seedMasterPdfDataset');
    await seedMasterPdfDataset();
    const lessons = await countOf('lessons');
    console.log(`[Content] Class 11 dataset: seeded (${lessons} lessons) in ${((Date.now() - started) / 1000).toFixed(1)}s`);
    return { label: 'Class 11 dataset', added: lessons };
  } catch (err) {
    console.error(`[Content] Class 11 dataset FAILED: ${err.message}`);
    return { label: 'Class 11 dataset', error: err.message };
  }
}

async function ensureContent() {
  const results = [];

  results.push(await ensureClass11Dataset());

  // Vocabulary must come after the Class 11 step, which clears this table but
  // never refills it — leaving the trainer, the flashcards and the whole
  // spaced-repetition engine with nothing to show.
  results.push(await ensure('Vocabulary', 'vocabulary', async () => {
    await require('./seedVocabulary')();
  }));

  results.push(await ensure('Grammar topics', 'grammar_topics', async () => {
    await require('./seedGrammar')();
  }));

  // Speaking, reading, listening, writing, achievements and the public chat rooms.
  results.push(await ensure('Practice & chat rooms', 'chat_rooms', async () => {
    await require('./seedQuizzes')();
  }));

  results.push(await ensure('Battle question bank', 'battle_questions', async () => {
    await require('./seedBattleQuestions')();
  }));

  // The expansion pack tops up several tables rather than owning one, so it is
  // measured against exercises.
  results.push(await ensure('Expansion pack', 'exercises', async () => {
    await require('./seedExpandedContent')();
  }));

  const added = results.filter((r) => r.added);
  const failed = results.filter((r) => r.error);

  if (added.length) console.log(`[Content] Filled ${added.length} area(s) on this boot.`);
  if (failed.length) console.error(`[Content] ${failed.length} area(s) failed — the app will show gaps there.`);
  if (!added.length && !failed.length) console.log('[Content] All content present.');

  return results;
}

module.exports = ensureContent;

if (require.main === module) {
  (async () => {
    await db.initMySQL();
    await require('./seedFoundations').seedFoundations();
    await ensureContent();
    process.exit(0);
  })().catch((err) => {
    console.error('❌ ensureContent failed:', err.message);
    process.exit(1);
  });
}
