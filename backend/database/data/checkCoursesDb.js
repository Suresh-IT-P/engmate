const db = require('../../src/config/db');

async function checkCourses() {
  const courses = await db.query('SELECT id, title FROM courses');
  console.log('Current Courses in SQLite:', courses);
}

checkCourses().then(() => process.exit(0)).catch(console.error);
