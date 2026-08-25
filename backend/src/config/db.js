const config = require('./env');
const fs = require('fs');
const path = require('path');

let mysqlPool = null;

/**
 * Build the SSL config for Aiven (or any SSL-required MySQL).
 * Priority:
 *  1. DB_CA_CERT env var (base64-encoded cert — for Render/cloud deployments)
 *  2. Local certs/aiven-ca.pem file (for local dev)
 *  3. Plain { rejectUnauthorized: false } fallback
 */
function buildSslConfig() {
  if (!config.db.ssl) return undefined;

  // Render / cloud: CA cert stored as base64 env var
  if (process.env.DB_CA_CERT) {
    const ca = Buffer.from(process.env.DB_CA_CERT, 'base64').toString('utf8');
    return { ca, rejectUnauthorized: true };
  }

  // Local dev: CA cert file
  const certPath = path.resolve(__dirname, '../../certs/aiven-ca.pem');
  if (fs.existsSync(certPath)) {
    return { ca: fs.readFileSync(certPath), rejectUnauthorized: true };
  }

  // Fallback — still uses SSL but skips CA verification
  return { rejectUnauthorized: false };
}

async function initMySQL() {
  const mysql = require('mysql2/promise');
  const sslConfig = buildSslConfig();

  try {
    const adminConn = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      connectTimeout: 5000,
      ...(sslConfig && { ssl: sslConfig })
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
      keepAliveInitialDelay: 0,
      ...(sslConfig && { ssl: sslConfig })
    });
    await mysqlPool.query('SELECT 1');
    console.log(`[Database] Connected successfully to MySQL (${config.db.database} on ${config.db.host}:${config.db.port})`);
    return true;
  } catch (err) {
    mysqlPool = null;
    console.error(`[Database] CRITICAL: MySQL connection failed (${config.db.host}:${config.db.port}): ${err.message}`);
    throw err;
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
