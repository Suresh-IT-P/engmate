const fs = require('fs');
const initSqlJs = require('sql.js');
const path = require('path');

(async () => {
  const SQL = await initSqlJs();
  const dbPath = path.resolve(__dirname, 'database/englishmate.sqlite');
  const fileBuffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(fileBuffer);
  
  console.log('Connected to SQLite via sql.js');

  try {
    db.run(`
      DELETE FROM lesson_content 
      WHERE id NOT IN (
        SELECT MAX(id) 
        FROM lesson_content 
        GROUP BY lesson_id, section_type
      )
    `);
    console.log('Duplicates deleted from lesson_content!');
    
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
    console.log('Saved back to disk!');
  } catch(err) {
    console.error(err);
  }
})();
