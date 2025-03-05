const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const DB_FILE = 'financev2.sqlite';
const SCHEMA_FILE = 'schema.sql';

// Connect to the database (creates file if it doesn't exist)
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Run schema.sql if the database is empty
function initializeDatabase() {
    db.get("SELECT name FROM sqlite_master WHERE type='table' LIMIT 1;", (err, row) => {
        if (!row) {
            console.log('No tables found, initializing database...');
            const schema = fs.readFileSync(SCHEMA_FILE, 'utf8');
            db.exec(schema, (err) => {
                if (err) {
                    console.error('Error initializing database:', err.message);
                } else {
                    console.log('Database initialized successfully.');
                }
            });
        } else {
            console.log('Database already initialized.');
        }
    });
}

// Function to update the schema dynamically
function updateSchema(sql) {
    db.exec(sql, (err) => {
        if (err) {
            console.error('Error updating schema:', err.message);
        } else {
            console.log('Schema updated successfully.');
        }
    });
}

// Example: Adding a new column dynamically
const addNewColumn = `
    ALTER TABLE reports ADD COLUMN generated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
`;
// updateSchema(addNewColumn);  // Uncomment to apply new changes dynamically

// Close the database connection when done
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});

module.exports = db;
