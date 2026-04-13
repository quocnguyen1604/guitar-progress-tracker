const { contextBridge, ipcRenderer } = require("electron");

const api = {
  getStatus: () => ipcRenderer.invoke("app:get-status"),
  openAddSongWindow: () => ipcRenderer.invoke("window:open-add-song-window"),
};

const songApi = {
  getAllSongs: () => ipcRenderer.invoke("songs:get-all-songs"),
  addSong: (songData) => ipcRenderer.invoke("songs:add", songData),
  updateSong: (id, songData) =>
    ipcRenderer.invoke("songs:update", id, songData),
  deleteSong: (id) => ipcRenderer.invoke("songs:delete", id),
  onSongListUpdated: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("songs:song-list-updated", listener);
    const unsubscribe = () => {
      ipcRenderer.removeListener("songs:song-list-updated", listener);
    };

    return unsubscribe;
  },
};

contextBridge.exposeInMainWorld("appApi", api);
contextBridge.exposeInMainWorld("songApi", songApi);
