const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

async function seedExercises() {
  const exercises = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/exercises.json'), 'utf8'));

  let exCount = 0;
  let qCount = 0;
  let optCount = 0;

  for (const ex of exercises) {
    const existing = await db.query('SELECT id FROM exercises WHERE id = ?', [ex.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO exercises (id, lesson_id, grammar_id, category_id, level_id, title, exercise_type, instructions, tamil_instructions, xp_points, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ex.id, ex.lesson_id, ex.grammar_id, ex.category_id, ex.level_id, ex.title, ex.exercise_type, ex.instructions, ex.tamil_instructions, ex.xp_points, ex.order_index]
      );
      exCount++;
    }

    if (ex.questions && Array.isArray(ex.questions)) {
      for (const q of ex.questions) {
        const existingQ = await db.query(
          'SELECT id FROM questions WHERE exercise_id = ? AND question_text = ?',
          [ex.id, q.question_text]
        );
        let qId;
        if (existingQ.length === 0) {
          const res = await db.execute(
            `INSERT INTO questions (exercise_id, question_text, tamil_subtext, correct_answer, explanation, tamil_explanation, hint, points, order_index)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [ex.id, q.question_text, q.tamil_subtext, q.correct_answer, q.explanation, q.tamil_explanation, q.hint || '', q.points, 1]
          );
          qId = res.insertId;
          qCount++;
        } else {
          qId = existingQ[0].id;
        }

        if (q.options && Array.isArray(q.options)) {
          for (const opt of q.options) {
            const optText = typeof opt === 'string' ? opt : opt.option_text;
            const tamilText = typeof opt === 'object' ? (opt.tamil_text || '') : '';
            const isCorrect = typeof opt === 'object' ? !!opt.is_correct : (optText === q.correct_answer);

            const existingOpt = await db.query(
              'SELECT id FROM question_options WHERE question_id = ? AND option_text = ?',
              [qId, optText]
            );
            if (existingOpt.length === 0) {
              await db.execute(
                `INSERT INTO question_options (question_id, option_text, tamil_text, is_correct, order_index)
                 VALUES (?, ?, ?, ?, ?)`,
                [qId, optText, tamilText, isCorrect ? 1 : 0, 1]
              );
              optCount++;
            }
          }
        }
      }
    }
  }

  return {
    exercises: exercises.length,
    questions: qCount,
    options: optCount
  };
}

module.exports = seedExercises;
