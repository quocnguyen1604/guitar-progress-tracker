import { Song, AddSongInput } from "../../src/shared/types/song.js";
import { getDatabase } from "./db.js";
import crypto from "node:crypto";
import {
  songInputSchema,
  updateSongInputSchema,
} from "../../src/shared/validation/songSchema.js";

type SongRow = {
  id: string;
  title: string;
  artist: string | null;
  thumbnail_url: string | null;
  thumbnail_path: string | null;
  song_link: string | null;
  tab_link: string | null;
  local_tab_path: string | null;
  target_bpm: number;
  current_practice_bpm: number;
  progress: number;
  notes: string | null;
  created_at: number;
  updated_at: number;
};

function rowToSong(row: SongRow): Song {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    thumbnailPath: row.thumbnail_path ?? undefined,
    songLink: row.song_link ?? undefined,
    tabLink: row.tab_link ?? undefined,
    localTabPath: row.local_tab_path ?? undefined,
    targetBpm: row.target_bpm,
    currentPracticeBpm: row.current_practice_bpm,
    progress: row.progress,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function checkIfSongExists(id: string): boolean {
  const db = getDatabase();
  const result = db
    .prepare("SELECT COUNT(*) AS count FROM songs WHERE id = ?")
    .get(id) as { count: number };
  return result.count > 0;
}

export function createSong(input: AddSongInput): boolean {
  const parsed = songInputSchema.safeParse(input);
  if (!parsed.success) {
    console.error("Invalid song input:", parsed.error);
    return false;
  }
  const data = parsed.data;
  const db = getDatabase();
  const id = crypto.randomUUID();
  db.prepare(
    `
    INSERT INTO songs (
      id, title, artist, thumbnail_url, thumbnail_path, song_link, tab_link,
      local_tab_path, target_bpm, current_practice_bpm, progress, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run([
    id,
    data.title,
    data.artist,
    data.thumbnailUrl,
    data.thumbnailPath,
    data.songLink,
    data.tabLink,
    data.localTabPath,
    data.targetBpm,
    data.currentPracticeBpm,
    data.progress,
    data.notes,
    Date.now(),
    Date.now(),
  ]);

  return checkIfSongExists(id);
}

export function getAllSongs(): Song[] {
  const db = getDatabase();
  const rows = db
    .prepare("SELECT * FROM songs ORDER BY updated_at DESC")
    .all() as SongRow[];
  return rows.map(rowToSong);
}

export function deleteSong(id: string): boolean {
  const db = getDatabase();
  const result = db.prepare("DELETE FROM songs WHERE id = ?").run(id);
  return result.changes > 0;
}

export function updateSong(
  id: string,
  updates: Partial<AddSongInput>,
): boolean {
  const parsed = updateSongInputSchema.safeParse(updates);

  if (!parsed.success) {
    console.error("Invalid song update input:", parsed.error);
    return false;
  }

  const data = parsed.data;
  const db = getDatabase();
  const existingRow = db.prepare("SELECT * FROM songs WHERE id = ?").get(id) as
    | SongRow
    | undefined;
  const existingSong = existingRow ? rowToSong(existingRow) : null;
  if (!existingSong) {
    console.error(`Song with id ${id} not found for update.`);
    return false;
  }

  const updatedSong = {
    ...existingSong,
    ...data,
    updatedAt: Date.now(),
  };
  const result = db
    .prepare(
      `
        UPDATE songs SET
            title = ?, artist = ?, thumbnail_url = ?, thumbnail_path = ?,
            song_link = ?, tab_link = ?, local_tab_path = ?, target_bpm = ?,
            current_practice_bpm = ?, progress = ?, notes = ?, updated_at = ?
        WHERE id = ?
        `,
    )
    .run([
      updatedSong.title,
      updatedSong.artist,
      updatedSong.thumbnailUrl,
      updatedSong.thumbnailPath,
      updatedSong.songLink,
      updatedSong.tabLink,
      updatedSong.localTabPath,
      updatedSong.targetBpm,
      updatedSong.currentPracticeBpm,
      updatedSong.progress,
      updatedSong.notes,
      updatedSong.updatedAt,
      id,
    ]);
  return result.changes > 0;
}
