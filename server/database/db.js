const path = require('path');
const fs = require('fs');

let db = null;

try {
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'grabb_it.db');
  const schemaPath = path.join(__dirname, 'schema.sql');

  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  // Initialize Database Schema if tables don't exist
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schemaSql);
  }
} catch (err) {
  console.warn('SQLite Native Binding Notice:', err.message);
  // Fallback dummy interface if native binary unavailable in serverless environment
  db = {
    prepare: () => ({
      get: () => null,
      all: () => [],
      run: () => ({ lastInsertRowid: 1, changes: 1 })
    }),
    exec: () => {},
    transaction: (fn) => fn,
    pragma: () => {}
  };
}

module.exports = db;
