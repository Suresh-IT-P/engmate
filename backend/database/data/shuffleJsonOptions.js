const fs = require('fs');
const path = require('path');

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const exercisesPath = path.resolve(__dirname, 'exercises.json');
if (fs.existsSync(exercisesPath)) {
  const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));
  for (const ex of exercises) {
    if (ex.questions && Array.isArray(ex.questions)) {
      for (const q of ex.questions) {
        if (q.options && Array.isArray(q.options) && q.options.length > 1) {
          q.options = shuffleArray(q.options);
        }
      }
    }
  }
  fs.writeFileSync(exercisesPath, JSON.stringify(exercises, null, 2), 'utf8');
  console.log('✓ Shuffled options in exercises.json');
}

const quizPath = path.resolve(__dirname, 'quiz_questions.json');
if (fs.existsSync(quizPath)) {
  const quizzes = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
  for (const q of quizzes) {
    if (q.options && Array.isArray(q.options) && q.options.length > 1) {
      q.options = shuffleArray(q.options);
    }
  }
  fs.writeFileSync(quizPath, JSON.stringify(quizzes, null, 2), 'utf8');
  console.log('✓ Shuffled options in quiz_questions.json');
}
