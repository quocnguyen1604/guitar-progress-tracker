import { app, BrowserWindow, ipcMain } from "electron";
import {
  getAllSongs,
  createSong,
  updateSong,
  deleteSong,
} from "../services/song.js";
import path from "node:path";
import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import crypto from "node:crypto";

type ThumbnailUploadInput = {
  bytes: Uint8Array;
  mimeType: "image/png" | "image/jpeg";
  extension: "png" | "jpg";
};

function saveThumbnailFile(
  songId: string,
  thumbnailUpload: ThumbnailUploadInput,
): { filePath: string } {
  const dataDirectory = path.join(
    app.getPath("userData"),
    "guitar-progress-tracker",
  );
  const thumbnailsDirectory = path.join(dataDirectory, "thumbnails");
  mkdirSync(thumbnailsDirectory, { recursive: true });

  const fileName = `${songId}.${thumbnailUpload.extension}`;
  const filePath = path.join(thumbnailsDirectory, fileName);
  writeFileSync(filePath, Buffer.from(thumbnailUpload.bytes));

  return { filePath };
}

export const registerSongIPC = () => {
  ipcMain.handle("songs:get-all-songs", () => {
    return getAllSongs();
  });
  ipcMain.handle("songs:add", async (event, songData, thumbnailUpload) => {
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
  ipcMain.handle("songs:update", async (event, songId, updates) => {
    const updatedSong = await updateSong(songId, updates);
    if (updatedSong) {
      BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send("songs:song-list-updated");
      });
    }
    return updatedSong;
  });
  ipcMain.handle("songs:delete", async (event, songId) => {
    const deletedSong = await deleteSong(songId);
    if (deletedSong) {
      BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send("songs:song-list-updated");
      });
    }
    return deletedSong;
  });
};
