const db = require('../../src/config/db');
const seedAll = require('./seed');

async function resetDb() {
  console.log('⚠️  Resetting English Mate database tables...');
  const isMySQL = (await db.getActiveEngineName()) === 'mysql';

  const tables = [
    'ai_messages', 'ai_conversations', 'notifications', 'mistake_logs', 'bookmarks',
    'user_achievements', 'achievements', 'streaks', 'daily_goals', 'learning_sessions',
    'writing_prompts', 'listening_lessons', 'reading_passages', 'conversation_topics',
    'speaking_topics', 'quiz_answers', 'quiz_attempts', 'question_options', 'questions',
    'exercises', 'grammar_examples', 'grammar_topics', 'user_vocabulary', 'vocabulary_examples',
    'vocabulary', 'lesson_content', 'user_progress', 'lessons', 'modules', 'courses',
    'content_categories', 'user_settings', 'user_profiles', 'admin_users', 'users', 'learning_levels'
  ];

  await db.execute('SET FOREIGN_KEY_CHECKS = 0');
  for (const t of tables) {
    try {
      await db.execute(`DROP TABLE IF EXISTS ${t}`);
    } catch (err) {
      // ignore
    }
  }
  await db.execute('SET FOREIGN_KEY_CHECKS = 1');

  console.log('✓ Tables dropped cleanly. Re-running migration and seeds...\n');
  await seedAll();
}

if (require.main === module) {
  resetDb()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Reset failed:', err);
      process.exit(1);
    });
}

module.exports = resetDb;
