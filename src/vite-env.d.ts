/// <reference types="vite/client" />

import { Song } from "./shared/types/song";
import type { AddSongInput, UpdateSongInput } from "./shared/types/song";

type ThumbnailUploadInput = {
  bytes: Uint8Array;
  mimeType: "image/png" | "image/jpeg";
  extension: "png" | "jpg";
};

declare global {
  interface Window {
    appApi: {
      getStatus: () => Promise<{
        mode: "development" | "production";
        electron: string;
        node: string;
        chrome: string;
      }>;
      openAddSongWindow: () => Promise<void>;
    };
    songApi: {
      addSong: (
        songData: AddSongInput,
        thumbnailUpload?: ThumbnailUploadInput,
      ) => Promise<[boolean, string]>;
      getAllSongs: () => Promise<Song[]>;
      updateSong: (id: string, songData: UpdateSongInput) => Promise<boolean>;
      deleteSong: (id: string) => Promise<boolean>;
      onSongListUpdated: (callback: () => void) => () => void;
    };
  }
}

export {};
