const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  const configs = [
    { host: process.env.DB_HOST || 'localhost', port: parseInt(process.env.DB_PORT || '3306', 10), user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '' },
    { host: 'localhost', port: 3306, user: 'root', password: 'root' },
    { host: 'localhost', port: 3306, user: 'root', password: 'password' },
    { host: '127.0.0.1', port: 3306, user: 'root', password: '' },
  ];

  console.log('Testing MySQL connections...');
  let connected = false;
  let successfulConfig = null;

  for (const cfg of configs) {
    try {
      console.log(`Trying MySQL at ${cfg.host}:${cfg.port} with user '${cfg.user}' (password: ${cfg.password ? '***' : 'empty'})...`);
      const conn = await mysql.createConnection(cfg);
      console.log('✓ Successfully connected to MySQL server!');
      
      await conn.query('CREATE DATABASE IF NOT EXISTS `englishmate` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
      console.log('✓ Database `englishmate` verified/created.');
      await conn.end();
      connected = true;
      successfulConfig = cfg;
      break;
    } catch (err) {
      console.log(`✗ Failed: ${err.message} (Code: ${err.code})`);
    }
  }

  if (connected) {
    console.log('\n========================================');
    console.log('MySQL is ready! Working configuration:');
    console.log(JSON.stringify(successfulConfig, null, 2));
    console.log('========================================');
  } else {
    console.log('\nCould not connect to local MySQL on standard ports/credentials.');
  }
}

testConnection();
