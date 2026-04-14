const { contextBridge, ipcRenderer } = require("electron");

const api = {
  getStatus: () => ipcRenderer.invoke("app:get-status"),
  openAddSongWindow: () => ipcRenderer.invoke("window:open-add-song-window"),
};

const songApi = {
  getAllSongs: () => ipcRenderer.invoke("songs:get-all-songs"),
  addSong: (songData, thumbnailUpload) =>
    ipcRenderer.invoke("songs:add", songData, thumbnailUpload),
  updateSong: (id, songData, thumbnailUpload) =>
    ipcRenderer.invoke("songs:update", id, songData, thumbnailUpload),
  deleteSong: (id) => ipcRenderer.invoke("songs:delete", id),
  onSongListUpdated: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("songs:song-list-updated", listener);
    const unsubscribe = () => {
      ipcRenderer.removeListener("songs:song-list-updated", listener);
    };
    return unsubscribe;
  },
  getSongThumbnail: (thumbnailPath) =>
    ipcRenderer.invoke("songs:get-thumbnail", thumbnailPath),
};

const discordApi = {
  saveSettings: (settings) =>
    ipcRenderer.invoke("discord:save-discord-settings", settings),
  loadSettings: () => ipcRenderer.invoke("discord:load-discord-settings"),
  testDiscordRPC: () => ipcRenderer.invoke("discord:test-discord-rpc"),
  testDiscordRPCDisconnect: () =>
    ipcRenderer.invoke("discord:test-discord-rpc-disconnect"),
  startDiscordSongRPC: (songId) =>
    ipcRenderer.invoke("discord:start-discord-song-rpc", songId),
  stopDiscordSongRPC: () => ipcRenderer.invoke("discord:stop-discord-song-rpc"),
};

contextBridge.exposeInMainWorld("appApi", api);
contextBridge.exposeInMainWorld("songApi", songApi);
contextBridge.exposeInMainWorld("discordApi", discordApi);
