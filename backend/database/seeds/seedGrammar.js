const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

async function seedGrammar() {
  const grammarTopics = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/grammar.json'), 'utf8'));

  let topicCount = 0;
  let examplesCount = 0;

  for (const g of grammarTopics) {
    const existing = await db.query('SELECT id FROM grammar_topics WHERE id = ?', [g.id]);

    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO grammar_topics (id, title, tamil_title, level_id, category_id, summary, tamil_summary, rule_formula, explanation, beginner_explanation, common_mistakes, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [g.id, g.title, g.tamil_title, g.level_id, g.category_id, g.summary, g.tamil_summary, g.rule_formula, g.explanation, g.beginner_explanation, g.common_mistakes, g.order_index]
      );
      topicCount++;
    }

    if (g.examples && Array.isArray(g.examples)) {
      for (const ex of g.examples) {
        const existingEx = await db.query(
          'SELECT id FROM grammar_examples WHERE grammar_id = ? AND example_sentence = ?',
          [g.id, ex.sentence]
        );
        if (existingEx.length === 0) {
          await db.execute(
            `INSERT INTO grammar_examples (grammar_id, example_sentence, tamil_translation, is_correct, explanation)
             VALUES (?, ?, ?, ?, ?)`,
            [g.id, ex.sentence, ex.tamil_translation, ex.is_correct ? 1 : 0, ex.explanation || '']
          );
          examplesCount++;
        }
      }
    }
  }

  return {
    grammarTopics: grammarTopics.length,
    insertedTopics: topicCount,
    grammarExamples: examplesCount
  };
}

module.exports = seedGrammar;
