import { BrowserWindow, ipcMain } from "electron";
import {
  getAllSongs,
  createSong,
  updateSong,
  deleteSong,
  saveThumbnailFile,
  getThumbnailFile,
} from "../services/song.js";
import { unlinkSync } from "node:fs";
import crypto from "node:crypto";

export const registerSongIPC = () => {
  ipcMain.handle("songs:get-all-songs", () => {
    return getAllSongs();
  });
  ipcMain.handle("songs:add", async (_event, songData, thumbnailUpload) => {
    void _event;
    const songId = crypto.randomUUID();
    const thumbnailFile = thumbnailUpload
      ? saveThumbnailFile(songId, thumbnailUpload)
      : undefined;

    const newSong = await createSong(
      {
        ...songData,
        thumbnailPath: thumbnailFile?.filePath,
      },
      songId,
    );

    if (!newSong[0] && thumbnailFile) {
      try {
        unlinkSync(thumbnailFile.filePath);
      } catch (error) {
        console.error("Failed to clean up orphan thumbnail file", error);
      }
    }

    if (newSong[0]) {
      BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send("songs:song-list-updated");
      });
    }
    return newSong;
  });
  ipcMain.handle(
    "songs:update",
    async (_event, songId, updates, thumbnailUpload) => {
      void _event;
      const updatedSong = await updateSong(songId, updates, thumbnailUpload);
      if (updatedSong) {
        BrowserWindow.getAllWindows().forEach((window) => {
          window.webContents.send("songs:song-list-updated");
        });
      }
      return updatedSong;
    },
  );
  ipcMain.handle("songs:delete", async (_event, songId) => {
    void _event;
    const deletedSong = await deleteSong(songId);
    if (deletedSong) {
      BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send("songs:song-list-updated");
      });
    }
    return deletedSong;
  });
  ipcMain.handle("songs:get-thumbnail", async (_event, thumbnailPath) => {
    void _event;
    return getThumbnailFile(thumbnailPath);
  });
};
