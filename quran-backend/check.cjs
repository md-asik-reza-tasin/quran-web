const db = require('better-sqlite3')('Quraan.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
tables.forEach(t => {
  console.log('Table:', t.name);
  console.log(db.prepare(`PRAGMA table_info("${t.name}")`).all());
});
