import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

type SqliteDatabase = InstanceType<typeof Database>;

let dbInstance: SqliteDatabase | null = null;

function createSchema(db: SqliteDatabase) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS songs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT,
      thumbnail_url TEXT,
      thumbnail_path TEXT,
      song_link TEXT,
      tab_link TEXT,
      local_tab_path TEXT,
      target_bpm INTEGER NOT NULL,
      current_practice_bpm INTEGER NOT NULL,
      progress INTEGER NOT NULL CHECK(progress >= 0 AND progress <= 100),
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_songs_updated_at ON songs(updated_at DESC);
  `);
}

export function initializeDatabase(appDataPath: string): SqliteDatabase {
  if (dbInstance) {
    return dbInstance;
  }

  const dataDirectory = path.join(appDataPath, "guitar-progress-tracker");
  mkdirSync(dataDirectory, { recursive: true });

  const databasePath = path.join(dataDirectory, "tracker.db");
  const db = new Database(databasePath);
  createSchema(db);
  db.pragma("journal_mode = WAL");

  dbInstance = db;
  return db;
}

export function getDatabase(): SqliteDatabase {
  if (!dbInstance) {
    throw new Error(
      "Database is not initialized. Call initializeDatabase first.",
    );
  }

  return dbInstance;
}
