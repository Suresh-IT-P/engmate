const config = require('./env');

let mysqlPool = null;

async function initMySQL() {
  const mysql = require('mysql2/promise');

  try {
    const adminConn = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      connectTimeout: 3000
    });
    await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await adminConn.end();
  } catch (dbErr) {
    // Continue to try direct pool connection if admin connection failed
  }

  try {
    mysqlPool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
    await mysqlPool.query('SELECT 1');
    console.log(`[Database] Connected successfully to MySQL (${config.db.database} on ${config.db.host}:${config.db.port})`);
    return true;
  } catch (err) {
    mysqlPool = null;
    console.error(`[Database] CRITICAL: MySQL connection failed (${config.db.host}:${config.db.port}): ${err.message}`);
    throw err; // Fail loudly instead of falling back to SQLite
  }
}

async function getEngine() {
  if (!mysqlPool) {
    await initMySQL();
  }
  return 'mysql';
}

async function query(sql, params = []) {
  await getEngine();
  const [rows] = await mysqlPool.query(sql, params);
  return rows;
}

async function execute(sql, params = []) {
  await getEngine();
  const [result] = await mysqlPool.execute(sql, params);
  return {
    insertId: result.insertId,
    affectedRows: result.affectedRows,
    changedRows: result.changedRows
  };
}

async function execDirect(rawSql) {
  await getEngine();
  await mysqlPool.query(rawSql);
}

function getActiveEngineName() {
  return 'mysql';
}

// Stubs for SQLite functions to avoid breaking older seed scripts temporarily
async function getSQLiteDb() {
  throw new Error('SQLite has been completely removed from this project.');
}
function persistSQLite() {
  // no-op
}

module.exports = {
  query,
  execute,
  execDirect,
  initMySQL,
  getSQLiteDb,
  persistSQLite,
  getActiveEngineName
};
