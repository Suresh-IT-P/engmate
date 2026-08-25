const app = require('./src/app');
const config = require('./src/config/env');
const db = require('./src/config/db');
const runMigration = require('./database/migrations/migrate');
const { seedFoundations, repairOrphanedUsers } = require('./database/seeds/seedFoundations');
const ensureContent = require('./database/seeds/ensureContent');
const http = require('http');
const initGameSocket = require('./src/socket/gameHandler');
const initChatSocket = require('./src/socket/chatHandler');

process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

const PORT = config.port || 5000;

async function startServer() {
  try {
    console.log('🚀 Initializing English Mate API Server...');
    
    // Test DB connection and ensure migration has run
    await db.initMySQL();
    await runMigration();

    // Reference rows first. Everything below has a foreign key to
    // learning_levels — including the profile created at registration — so a
    // deploy against an empty database fails at the first insert without this.
    try {
      const foundations = await seedFoundations();
      console.log(`🌱 Foundations ready: ${foundations.levels} levels, ${foundations.categories} categories`);

      // Heal accounts left profile-less by the old non-transactional register.
      const repaired = await repairOrphanedUsers();
      if (repaired > 0) console.log(`🩹 Repaired ${repaired} account(s) that had no profile`);
    } catch (foundErr) {
      // Loud, because registration and all content seeding depend on this.
      console.error('[Foundations] CRITICAL — levels/categories not seeded:', foundErr.message);
    }

    const server = http.createServer(app);
    const io = initGameSocket(server);
    initChatSocket(io);

    server.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  🌟 English Mate — AI English Bridge Backend Running  `);
      console.log(`  🔗 API Base URL: http://localhost:${PORT}/api        `);
      console.log(`  🩺 Health Check: http://localhost:${PORT}/api/health `);
      console.log(`  🎮 Multiplayer Socket Server Initialized           `);
      console.log(`  📞 Friend Chat & Voice Calling Ready               `);
      console.log(`  📊 Database Engine: ${db.getActiveEngineName()}      `);
      console.log(`======================================================\n`);

      // Content seeding runs after we are listening, not before. Populating the
      // 5,000-question battle bank over a remote database takes long enough to
      // trip a platform health check if it blocks start-up.
      ensureContent().catch((err) => {
        console.error('[Content] Bootstrap failed:', err.message);
      });
    });
  } catch (err) {
    console.error('❌ Failed to start English Mate server:', err);
    process.exit(1);
  }
}

startServer();
