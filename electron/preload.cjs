const { contextBridge, ipcRenderer } = require("electron");

const api = {
  getStatus: () => ipcRenderer.invoke("app:get-status"),
  openAddSongWindow: () => ipcRenderer.invoke("window:open-add-song-window"),
};

contextBridge.exposeInMainWorld("appApi", api);
