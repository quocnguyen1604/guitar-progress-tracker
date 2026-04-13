import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeDatabase } from "./services/db.js";
import { registerSongIPC } from "./ipc/songs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  const preloadPath = path.join(__dirname, "../../electron/preload.cjs");

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 760,
    minWidth: 980,
    minHeight: 640,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    void mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools({ mode: "detach" });
    return;
  }

  void mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
}

app.whenReady().then(() => {
  initializeDatabase(app.getPath("userData"));
  registerSongIPC();

  ipcMain.handle("app:get-status", () => {
    return {
      mode: process.env.VITE_DEV_SERVER_URL ? "development" : "production",
      electron: process.versions.electron,
      node: process.versions.node,
      chrome: process.versions.chrome,
    };
  });

  ipcMain.handle("window:open-add-song-window", async () => {
    if (!mainWindow) return;
    const addSongWindow = new BrowserWindow({
      width: 400,
      height: 600,
      parent: mainWindow,
      modal: true,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        preload: path.join(__dirname, "../../electron/preload.cjs"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    const devServerUrl = process.env.VITE_DEV_SERVER_URL;
    if (devServerUrl) {
      await addSongWindow.loadURL(`${devServerUrl}#/add-song`);
      addSongWindow.webContents.openDevTools({ mode: "detach" });
      return;
    }
  });

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
