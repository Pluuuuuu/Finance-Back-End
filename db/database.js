const Database = require('better-sqlite3');
const db = new Database('./db/finance.db', { verbose: console.log });

db.pragma('foreign_keys = ON'); // Enable foreign keys

module.exports = db;