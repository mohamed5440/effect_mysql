import Database from 'better-sqlite3';
import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const missingEnvVars: string[] = [];
export const dbStatus = {
  initialized: false,
  error: null as string | null,
  type: 'sqlite' as 'sqlite' | 'mysql'
};

let mysqlPool: any = null;
let sqliteDb: any = null;

const USE_MYSQL = (process.env.MYSQL_HOST || process.env.DB_HOST) && 
                 (process.env.MYSQL_USER || process.env.DB_USER) && 
                 (process.env.MYSQL_DATABASE || process.env.DB_NAME);

// Check for missing vars early
if (!USE_MYSQL && process.env.NODE_ENV === 'production') {
  console.warn('[DB] MySQL variables missing, falling back to SQLite for production. DATA WILL BE LOST ON RESTART.');
}

const initializeDb = async () => {
  try {
    if (USE_MYSQL) {
      dbStatus.type = 'mysql';
      mysqlPool = mysql.createPool({
        host: process.env.MYSQL_HOST || process.env.DB_HOST,
        user: process.env.MYSQL_USER || process.env.DB_USER,
        password: process.env.MYSQL_PASSWORD || process.env.DB_PASS,
        database: process.env.MYSQL_DATABASE || process.env.DB_NAME,
        port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306'),
        ssl: (process.env.MYSQL_SSL === 'true' || process.env.DB_SSL === 'true') ? { rejectUnauthorized: false } : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      
      const conn = await mysqlPool.getConnection();
      console.log('[DB] Connected to MySQL successfully');
      
      // Initialize MySQL Schema
      await conn.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS applications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          location VARCHAR(255) NOT NULL,
          expertise VARCHAR(100) NOT NULL,
          experience VARCHAR(100) NOT NULL,
          portfolio VARCHAR(255) NOT NULL,
          skills TEXT NOT NULL,
          min_rate DECIMAL(10, 2) NOT NULL,
          max_rate DECIMAL(10, 2) NOT NULL,
          bio TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      conn.release();
    } else {
      dbStatus.type = 'sqlite';
      const dbPath = path.resolve(process.cwd(), 'database.sqlite');
      sqliteDb = new Database(dbPath);
      sqliteDb.pragma('journal_mode = WAL');
      
      sqliteDb.exec(`
        CREATE TABLE IF NOT EXISTS admins (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

        CREATE TABLE IF NOT EXISTS applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          location TEXT NOT NULL,
          expertise TEXT NOT NULL,
          experience TEXT NOT NULL,
          portfolio TEXT NOT NULL,
          skills TEXT NOT NULL,
          min_rate REAL NOT NULL,
          max_rate REAL NOT NULL,
          bio TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
      `);
      console.log('[DB] SQLite Schema initialized successfully');
    }
    
    dbStatus.initialized = true;
    dbStatus.error = null;
    return true;
  } catch (err: any) {
    dbStatus.error = err.message || String(err);
    console.error(`[DB] Error initializing ${dbStatus.type} database:`, err);
    throw err;
  }
};

export const dbInitialized = initializeDb();

const pool = {
  query: async (sql: string, params: any[] = []) => {
    await dbInitialized;
    
    if (dbStatus.type === 'mysql') {
      return await mysqlPool.query(sql, params);
    } else {
      // Basic translation for SQLite
      const stmt = sqliteDb.prepare(sql);
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const rows = stmt.all(...params);
        return [rows];
      } else {
        const info = stmt.run(...params);
        return [info];
      }
    }
  }
};

export default pool;
