/* database schema and creation */
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database("./database/db.sqlite", () => { console.log( 'Connected to sqlite database ')})

sqlite3.verbose();

db.serialize(() => {
    db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE, 
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user'
    )`)
})

export default db;