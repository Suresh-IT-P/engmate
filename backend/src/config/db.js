const config = require('./env');
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

let mysqlPool = null;
let sqlEngine = null;
let sqlDbInstance = null;
let activeEngine = 'sqlite';

async function getSQLiteDb() {
  if (!sqlDbInstance) {
    if (!sqlEngine) {
      sqlEngine = await initSqlJs();
    }
    const dbDir = path.dirname(config.db.sqlitePath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    if (fs.existsSync(config.db.sqlitePath)) {
      const fileBuffer = fs.readFileSync(config.db.sqlitePath);
      sqlDbInstance = new sqlEngine.Database(fileBuffer);
    } else {
      sqlDbInstance = new sqlEngine.Database();
    }
    activeEngine = 'sqlite';
  }
  return sqlDbInstance;
}

function persistSQLite() {
  if (sqlDbInstance && config.db.sqlitePath) {
    try {
      const data = sqlDbInstance.export();
      fs.writeFileSync(config.db.sqlitePath, Buffer.from(data));
    } catch (err) {
      console.warn('[Database] SQLite persistence warning:', err.message);
    }
  }
}

async function initMySQL() {
  try {
    const mysql = require('mysql2/promise');

    // First attempt to ensure database exists
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
    activeEngine = 'mysql';
    console.log(`[Database] Connected successfully to MySQL (${config.db.database} on ${config.db.host}:${config.db.port})`);
    return true;
  } catch (err) {
    mysqlPool = null;
    console.warn(`[Database] MySQL connection attempt (${config.db.host}:${config.db.port}): ${err.message}`);
    await getSQLiteDb();
    activeEngine = 'sqlite';
    return false;
  }
}

async function getEngine() {
  if (config.db.client === 'mysql' && !mysqlPool && activeEngine !== 'sqlite_forced') {
    const success = await initMySQL();
    if (success) return 'mysql';
  }
  if (!sqlDbInstance && activeEngine === 'sqlite') {
    await getSQLiteDb();
  }
  return activeEngine;
}

async function query(sql, params = []) {
  const engine = await getEngine();
  if (engine === 'mysql' && mysqlPool) {
    const [rows] = await mysqlPool.query(sql, params);
    return rows;
  } else {
    const db = await getSQLiteDb();
    let sqliteSql = sql
      .replace(/CURRENT_DATE\(\)/gi, "DATE('now')")
      .replace(/`([^`]+)`/g, '"$1"');

    const stmt = db.prepare(sqliteSql);
    try {
      const rows = [];
      stmt.bind(params.map(p => p === undefined ? null : p));
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      return rows;
    } finally {
      stmt.free();
    }
  }
}

async function execute(sql, params = []) {
  const engine = await getEngine();
  if (engine === 'mysql' && mysqlPool) {
    const [result] = await mysqlPool.execute(sql, params);
    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows,
      changedRows: result.changedRows
    };
  } else {
    const db = await getSQLiteDb();
    let sqliteSql = sql
      .replace(/CURRENT_DATE\(\)/gi, "DATE('now')")
      .replace(/`([^`]+)`/g, '"$1"');

    db.run(sqliteSql, params.map(p => p === undefined ? null : p));
    
    // Get last insert id
    const idRes = db.exec("SELECT last_insert_rowid() as id, changes() as changes");
    const lastId = idRes[0]?.values?.[0]?.[0] || 0;
    const changes = idRes[0]?.values?.[0]?.[1] || 0;

    persistSQLite();

    return {
      insertId: Number(lastId),
      affectedRows: changes,
      changes
    };
  }
}

async function execDirect(rawSql) {
  const engine = await getEngine();
  if (engine === 'mysql' && mysqlPool) {
    await mysqlPool.query(rawSql);
  } else {
    const db = await getSQLiteDb();
    db.exec(rawSql);
    persistSQLite();
  }
}

function getActiveEngineName() {
  return activeEngine;
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
