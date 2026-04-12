import { contextBridge, ipcRenderer } from "electron";

const api = {
  getStatus: () =>
    ipcRenderer.invoke("app:get-status") as Promise<{
      mode: "development" | "production";
      electron: string;
      node: string;
      chrome: string;
    }>,
};

contextBridge.exposeInMainWorld("appApi", api);
