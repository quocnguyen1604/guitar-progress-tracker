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
