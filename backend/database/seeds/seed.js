const runMigration = require('../migrations/migrate');
const seedUsers = require('./seedUsers');
const seedCourses = require('./seedCourses');
const seedLessons = require('./seedLessons');
const seedVocabulary = require('./seedVocabulary');
const seedGrammar = require('./seedGrammar');
const seedExercises = require('./seedExercises');
const seedQuizzes = require('./seedQuizzes');

async function seedAll() {
  console.log('====================================================');
  console.log('        English Mate Database Seeder');
  console.log('====================================================\n');

  // Ensure tables exist
  await runMigration();

  console.log('\n[Seeding] Injecting portable learning dataset...');
  
  const courseStats = await seedCourses();
  const lessonStats = await seedLessons();
  const vocabStats = await seedVocabulary();
  const grammarStats = await seedGrammar();
  const exerciseStats = await seedExercises();
  const quizStats = await seedQuizzes();
  const userStats = await seedUsers();

  console.log('\n----------------------------------------------------');
  console.log(`✓ Levels: ${courseStats.levels}`);
  console.log(`✓ Categories: ${courseStats.categories}`);
  console.log(`✓ Courses: ${courseStats.courses}`);
  console.log(`✓ Modules: ${courseStats.modules}`);
  console.log(`✓ Lessons: ${lessonStats.lessons}`);
  console.log(`✓ Lesson Content Sections: ${lessonStats.lessonContent}`);
  console.log(`✓ Vocabulary Words: ${vocabStats.vocabulary}`);
  console.log(`✓ Vocabulary Examples: ${vocabStats.examples}`);
  console.log(`✓ Grammar Topics: ${grammarStats.grammarTopics}`);
  console.log(`✓ Grammar Examples: ${grammarStats.grammarExamples}`);
  console.log(`✓ Exercises: ${exerciseStats.exercises}`);
  console.log(`✓ Quiz Questions: ${exerciseStats.questions}`);
  console.log(`✓ Speaking Topics: ${quizStats.speakingTopics}`);
  console.log(`✓ AI Conversations: ${quizStats.conversations}`);
  console.log(`✓ Reading Passages: ${quizStats.readingPassages}`);
  console.log(`✓ Listening Lessons: ${quizStats.listeningLessons}`);
  console.log(`✓ Writing Prompts: ${quizStats.writingPrompts}`);
  console.log(`✓ Achievements: ${quizStats.achievements}`);
  console.log(`✓ Seed Users & Profiles: ${userStats.users}`);
  console.log('----------------------------------------------------');
  console.log('\nDatabase seeding completed successfully.\n');
}

if (require.main === module) {
  seedAll()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = seedAll;
