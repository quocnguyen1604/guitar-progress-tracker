import { ipcMain } from "electron";
import {
  getAllSongs,
  createSong,
  updateSong,
  deleteSong,
} from "../services/song.js";

export const registerSongIPC = () => {
  ipcMain.handle("songs:get-all-songs", () => {
    return getAllSongs();
  });
  ipcMain.handle("songs:add", async (event, songData) => {
    return createSong(songData);
  });
  ipcMain.handle("songs:update", async (event, songId, updates) => {
    return updateSong(songId, updates);
  });
  ipcMain.handle("songs:delete", async (event, songId) => {
    return deleteSong(songId);
  });
};
