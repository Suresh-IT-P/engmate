const db = require('../../src/config/db');

async function debug() {
  const c1 = await db.query('SELECT * FROM courses WHERE id = ?', ['crs_class11']);
  console.log('Query for crs_class11:', c1);

  const c2 = await db.query('SELECT * FROM courses');
  console.log('All courses:', c2);
}

debug().then(() => process.exit(0)).catch(console.error);
