import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path (standard for ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This points specifically to the file in your backend root
const dbPath = path.resolve(__dirname, 'Quraan.db');

const db: Database.Database = new Database(dbPath, { 
    readonly: true, // Safety: prevents creating a new empty file if name is wrong
    fileMustExist: true // Throws an error immediately if the file isn't found
});

export default db;