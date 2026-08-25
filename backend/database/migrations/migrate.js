const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

async function runMigration() {
  const schemaPath = path.resolve(__dirname, '../schema.sql');
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at: ${schemaPath}`);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const isMySQL = (await db.getActiveEngineName()) === 'mysql';

  if (isMySQL) {
    const statements = schemaSql
      .split(';')
      .map(s => {
        // Strip all leading comment lines (-- ...) so CREATE TABLE
        // statements that follow a section comment are not discarded.
        return s.replace(/^(\s*--[^\n]*\n)*/g, '').trim();
      })
      .filter(s => s.length > 0);

    let count = 0;
    for (const sql of statements) {
      try {
        await db.execute(sql);
        count++;
      } catch (err) {
        const msg = err.message || '';
        if (
          !msg.includes('already exists') &&
          !msg.includes('Duplicate key name') &&
          !msg.includes('Duplicate column name')
        ) {
          console.warn(`[Migration Warning] ${err.message}`);
        }
      }
    }
    console.log(`[Migration] ${count} statements executed successfully.`);
  }

  // Ensure new columns exist on existing MySQL tables (safe ALTER — ignored if column already exists)
  const safeAddColumn = async (table, column, definition) => {
    try {
      await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
      console.log(`✓ Added column ${column} to ${table}`);
    } catch (err) {
      // Column likely already exists — ignore safely
    }
  };

  await safeAddColumn('users', 'username', 'VARCHAR(100)');
  await safeAddColumn('users', 'phone_number', 'VARCHAR(20)');
  await safeAddColumn('user_profiles', 'username', 'VARCHAR(100)');
  await safeAddColumn('user_profiles', 'phone_number', 'VARCHAR(20)');
}

if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('✓ Database migration completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Migration failed:', err);
      process.exit(1);
    });
}

module.exports = runMigration;
