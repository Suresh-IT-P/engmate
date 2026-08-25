const app = require('./src/app');
const config = require('./src/config/env');
const db = require('./src/config/db');
const runMigration = require('./database/migrations/migrate');
const seedMasterPdfDataset = require('./database/data/seedMasterPdfDataset');
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

    // Check if courses table has records; if not, auto-seed exclusive Class 11 dataset
    const courseCount = await db.query("SELECT COUNT(*) as count FROM courses WHERE id = 'crs_class11'");
    if (courseCount[0]?.count === 0) {
      console.log('🌱 Auto-seeding exclusive Class 11 WTS English dataset...');
      await seedMasterPdfDataset();
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
    });
  } catch (err) {
    console.error('❌ Failed to start English Mate server:', err);
    process.exit(1);
  }
}

startServer();
