import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeDatabase } from "./services/db.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function createMainWindow() {
    const preloadPath = path.join(__dirname, "../../electron/preload.cjs");
    const window = new BrowserWindow({
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
        void window.loadURL(devServerUrl);
        window.webContents.openDevTools({ mode: "detach" });
        return;
    }
    void window.loadFile(path.join(__dirname, "../../dist/index.html"));
}
app.whenReady().then(() => {
    initializeDatabase(app.getPath("userData"));
    ipcMain.handle("app:get-status", () => {
        return {
            mode: process.env.VITE_DEV_SERVER_URL ? "development" : "production",
            electron: process.versions.electron,
            node: process.versions.node,
            chrome: process.versions.chrome,
        };
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
