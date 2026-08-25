const db = require('../../src/config/db');

async function cleanRaw() {
  console.log('Cleaning up raw course to fix sql.js OOM crashes...');
  await db.execute("DELETE FROM courses WHERE id = 'crs_class11_raw'");
  console.log('Done cleaning.');
}

cleanRaw().then(() => process.exit(0)).catch(console.error);
