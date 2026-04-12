import { contextBridge, ipcRenderer } from "electron";
const api = {
    getStatus: () => ipcRenderer.invoke("app:get-status"),
};
contextBridge.exposeInMainWorld("appApi", api);
