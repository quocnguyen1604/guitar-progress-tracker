import { getDatabase } from "./db.js";
import crypto from "node:crypto";
function checkIfSongExists(id) {
    const db = getDatabase();
    const result = db
        .prepare("SELECT COUNT(*) AS count FROM songs WHERE id = ?")
        .get(id);
    return result.count > 0;
}
export function createSong(input) {
    const db = getDatabase();
    const id = crypto.randomUUID();
    db.prepare(`
    INSERT INTO songs (
      id, title, artist, thumbnail_url, thumbnail_path, song_link, tab_link,
      local_tab_path, target_bpm, current_practice_bpm, progress, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run([
        id,
        input.title,
        input.artist,
        input.thumbnailUrl,
        input.thumbnailPath,
        input.songLink,
        input.tabLink,
        input.localTabPath,
        input.targetBpm,
        input.currentPracticeBpm,
        input.progress,
        input.notes,
        Date.now(),
        Date.now(),
    ]);
    return checkIfSongExists(id);
}
export function getAllSongs() {
    const db = getDatabase();
    const rows = db
        .prepare("SELECT * FROM songs ORDER BY updated_at DESC")
        .all();
    return rows;
}
export function deleteSong(id) {
    const db = getDatabase();
    const result = db.prepare("DELETE FROM songs WHERE id = ?").run(id);
    return result.changes > 0;
}
export function updateSong(id, updates) {
    const db = getDatabase();
    const existingSong = db
        .prepare("SELECT * FROM songs WHERE id = ?")
        .get(id);
    if (!existingSong) {
        return false;
    }
    const updatedSong = {
        ...existingSong,
        ...updates,
        updatedAt: Date.now(),
    };
    const result = db
        .prepare(`
        UPDATE songs SET
            title = ?, artist = ?, thumbnail_url = ?, thumbnail_path = ?,
            song_link = ?, tab_link = ?, local_tab_path = ?, target_bpm = ?,
            current_practice_bpm = ?, progress = ?, notes = ?, updated_at = ?
        WHERE id = ?
        `)
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
