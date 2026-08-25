const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

async function seedVocabulary() {
  const vocabulary = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/vocabulary.json'), 'utf8'));

  let vocabCount = 0;
  let examplesCount = 0;

  for (const v of vocabulary) {
    const existing = await db.query('SELECT id FROM vocabulary WHERE word = ?', [v.word]);
    let vocabId;

    if (existing.length === 0) {
      const res = await db.execute(
        `INSERT INTO vocabulary (word, phonetic, part_of_speech, meaning, simple_meaning, tamil_meaning, level_id, category_id, synonyms, antonyms, related_words, common_mistakes, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [v.word, v.phonetic, v.part_of_speech, v.meaning, v.simple_meaning, v.tamil_meaning, v.level_id, v.category_id, v.synonyms, v.antonyms, v.related_words, v.common_mistakes, v.is_featured ? 1 : 0]
      );
      vocabId = res.insertId;
      vocabCount++;
    } else {
      vocabId = existing[0].id;
    }

    if (v.examples && Array.isArray(v.examples)) {
      for (const ex of v.examples) {
        const existingEx = await db.query(
          'SELECT id FROM vocabulary_examples WHERE vocabulary_id = ? AND sentence = ?',
          [vocabId, ex.sentence]
        );
        if (existingEx.length === 0) {
          await db.execute(
            `INSERT INTO vocabulary_examples (vocabulary_id, sentence, tamil_translation)
             VALUES (?, ?, ?)`,
            [vocabId, ex.sentence, ex.tamil_translation]
          );
          examplesCount++;
        }
      }
    }
  }

  return {
    vocabulary: vocabulary.length,
    insertedVocab: vocabCount,
    examples: examplesCount
  };
}

module.exports = seedVocabulary;
