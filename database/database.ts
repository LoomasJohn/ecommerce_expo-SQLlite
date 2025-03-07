import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';

const db: SQLiteDatabase = openDatabaseSync('ecommerce.db');

const executeQuery = async (query: string) => {
  const statement = await db.prepareAsync(query);
  await statement.executeAsync();
  await statement.finalizeAsync();
};

export const setupDatabase = async () => {
  await executeQuery('PRAGMA foreign_keys = ON;');

  // For development, you might want to drop tables to reinitialize the schema.
  // await executeQuery('DROP TABLE IF EXISTS products;');
  // await executeQuery('DROP TABLE IF EXISTS cart;');
  // await executeQuery('DROP TABLE IF EXISTS users;');

  // Create products table with seller_id and new category column
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      description TEXT,
      category TEXT,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await executeQuery(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      quantity INTEGER,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  await executeQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('buyer', 'seller')) NOT NULL DEFAULT 'buyer'
    );
  `);

  console.warn('Database tables initialized');
};

export const getDBConnection = () => db;
