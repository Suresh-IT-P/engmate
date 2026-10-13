const config = require('./env');
const fs = require('fs');
const path = require('path');

let mysqlPool = null;
let sqliteDb = null;
let activeEngine = 'mysql';

/**
 * Build the SSL config for Aiven (or any SSL-required MySQL).
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

function initSQLite() {
  if (!sqliteDb) {
    try {
      const { DatabaseSync } = require('node:sqlite');
      const sqlitePath = path.resolve(__dirname, '../../database/englishmate.sqlite');
      // Read "double-quoted" values as strings, the way MySQL does. Queries
      // written against MySQL used them, and on SQLite each one failed with
      // "no such column" — the AI tutor, friend requests and lessons among them.
      sqliteDb = new DatabaseSync(sqlitePath, { enableDoubleQuotedStringLiterals: true });
      activeEngine = 'sqlite';
      console.log(`[Database] Connected successfully to SQLite database (${sqlitePath})`);
      return true;
    } catch (err) {
      console.error(`[Database] CRITICAL: SQLite initialization failed: ${err.message}`);
      throw err;
    }
  }
  return true;
}

async function initMySQL() {
  if (config.db.client === 'sqlite') {
    initSQLite();
    return true;
  }

  const mysql = require('mysql2/promise');
  const sslConfig = buildSslConfig();

  try {
    const adminConn = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      connectTimeout: 4000,
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
      dateStrings: ['DATE'],
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      connectTimeout: 4000,
      ...(sslConfig && { ssl: sslConfig })
    });
    await mysqlPool.query('SELECT 1');
    activeEngine = 'mysql';
    console.log(`[Database] Connected successfully to MySQL (${config.db.database} on ${config.db.host}:${config.db.port})`);
    return true;
  } catch (err) {
    mysqlPool = null;
    console.warn(`[Database] MySQL connection attempt failed (${config.db.host}:${config.db.port}): ${err.message}`);
    console.log(`[Database] Seamlessly falling back to local SQLite database...`);
    initSQLite();
    return true;
  }
}

async function getEngine() {
  if (activeEngine === 'mysql' && !mysqlPool) {
    await initMySQL();
  } else if (activeEngine === 'sqlite' && !sqliteDb) {
    initSQLite();
  }
  return activeEngine;
}

function normalise(params) {
  if (!Array.isArray(params)) return params;
  return params.map((p) => (p === undefined ? null : p));
}

function normalizeSqlForSqlite(sql) {
  let s = sql
    .replace(/\bCURDATE\(\)/gi, "DATE('now')")
    .replace(/\bCURRENT_DATE\(\)/gi, "DATE('now')")
    .replace(/\bNOW\(\)/gi, "DATETIME('now')");

  // MySQL "ON DUPLICATE KEY UPDATE ..." -> in SQLite "INSERT OR REPLACE INTO ..."
  if (/ON\s+DUPLICATE\s+KEY\s+UPDATE/i.test(s)) {
    s = s.replace(/^INSERT\s+INTO/i, 'INSERT OR REPLACE INTO');
    s = s.replace(/\s+ON\s+DUPLICATE\s+KEY\s+UPDATE[\s\S]*$/i, '');
  }
  return s;
}

async function query(sql, params = []) {
  const engine = await getEngine();
  const normParams = normalise(params);
  if (engine === 'mysql' && mysqlPool) {
    const [rows] = await mysqlPool.query(sql, normParams);
    return rows;
  } else {
    const sSql = normalizeSqlForSqlite(sql);
    const stmt = sqliteDb.prepare(sSql);
    return stmt.all(...normParams);
  }
}

async function execute(sql, params = []) {
  const engine = await getEngine();
  const normParams = normalise(params);
  if (engine === 'mysql' && mysqlPool) {
    const [result] = await mysqlPool.execute(sql, normParams);
    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows,
      changedRows: result.changedRows
    };
  } else {
    const sSql = normalizeSqlForSqlite(sql);
    const stmt = sqliteDb.prepare(sSql);
    const info = stmt.run(...normParams);
    return {
      insertId: Number(info.lastInsertRowid),
      affectedRows: Number(info.changes),
      changedRows: Number(info.changes)
    };
  }
}

async function withTransaction(work) {
  const engine = await getEngine();
  if (engine === 'mysql' && mysqlPool) {
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
      } catch (_) {}
      throw err;
    } finally {
      conn.release();
    }
  } else {
    // SQLite transaction
    sqliteDb.exec('BEGIN IMMEDIATE');
    const tx = {
      query: async (sql, params = []) => {
        const sSql = normalizeSqlForSqlite(sql);
        return sqliteDb.prepare(sSql).all(...normalise(params));
      },
      execute: async (sql, params = []) => {
        const sSql = normalizeSqlForSqlite(sql);
        const info = sqliteDb.prepare(sSql).run(...normalise(params));
        return {
          insertId: Number(info.lastInsertRowid),
          affectedRows: Number(info.changes),
          changedRows: Number(info.changes)
        };
      }
    };

    try {
      const out = await work(tx);
      sqliteDb.exec('COMMIT');
      return out;
    } catch (err) {
      try {
        sqliteDb.exec('ROLLBACK');
      } catch (_) {}
      throw err;
    }
  }
}

async function execDirect(rawSql) {
  const engine = await getEngine();
  if (engine === 'mysql' && mysqlPool) {
    await mysqlPool.query(rawSql);
  } else {
    sqliteDb.exec(normalizeSqlForSqlite(rawSql));
  }
}

function getActiveEngineName() {
  return activeEngine;
}

async function getSQLiteDb() {
  initSQLite();
  return sqliteDb;
}

function persistSQLite() {
  // DatabaseSync writes synchronously to disk
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
