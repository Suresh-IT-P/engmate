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
      // DATE columns as strings: this codebase came from SQLite and compares
      // them with 'YYYY-MM-DD'. Without this, mysql2 returns a Date whose
      // .toString() is "Tue Aug 25", which silently broke every streak.
      dateStrings: ['DATE'],
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

/**
 * mysql2 throws "Bind parameters must not contain undefined" rather than
 * treating it as NULL, so an optional field the caller left off becomes a
 * 500 instead of a null column. Normalise here, once, for every query.
 */
function normalise(params) {
  if (!Array.isArray(params)) return params;
  return params.map((p) => (p === undefined ? null : p));
}

async function query(sql, params = []) {
  await getEngine();
  const [rows] = await mysqlPool.query(sql, normalise(params));
  return rows;
}

async function execute(sql, params = []) {
  await getEngine();
  const [result] = await mysqlPool.execute(sql, normalise(params));
  return {
    insertId: result.insertId,
    affectedRows: result.affectedRows,
    changedRows: result.changedRows
  };
}

/**
 * Run several statements as one atomic unit on a single pooled connection.
 *
 * Registration needs this: it writes a user, a profile, settings, a streak and
 * a notification. Without a transaction, a failure on any of the later inserts
 * leaves an orphaned users row behind — and because the phone number is unique,
 * that person can then never register again.
 *
 * The callback receives a tx object exposing the same query/execute signature.
 */
async function withTransaction(work) {
  await getEngine();
  const conn = await mysqlPool.getConnection();

  const tx = {
    query: async (sql, params = []) => {
      const [rows] = await conn.query(sql, normalise(params));
      return rows;
    },
    execute: async (sql, params = []) => {
      const [result] = await conn.execute(sql, normalise(params));
      return {
        insertId: result.insertId,
        affectedRows: result.affectedRows,
        changedRows: result.changedRows
      };
    }
  };

  try {
    await conn.beginTransaction();
    const out = await work(tx);
    await conn.commit();
    return out;
  } catch (err) {
    try {
      await conn.rollback();
    } catch (_) {
      /* the connection is already broken; releasing it is all we can do */
    }
    throw err;
  } finally {
    conn.release();
  }
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
  withTransaction,
  initMySQL,
  getSQLiteDb,
  persistSQLite,
  getActiveEngineName
};
