const db = require('../../src/config/db');

async function vacuumDB() {
  console.log('Vacuuming SQLite database to reclaim space...');
  await db.execDirect("VACUUM;");
  console.log('Done vacuuming.');
}

vacuumDB().then(() => process.exit(0)).catch(console.error);
