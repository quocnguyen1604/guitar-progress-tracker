import { ipcMain } from "electron";
import {
  loadDiscordSettings,
  saveDiscordSettings,
} from "../services/discord.js";
import {
  connectDiscordRPC,
  getDiscordRPCStatus,
  disconnectDiscordRPC,
  setDiscordSongRPCActivity,
  stopDiscordSongRPC,
} from "../services/discordRPC.js";

export const registerDiscordIPC = () => {
  ipcMain.handle("discord:load-discord-settings", async () => {
    return loadDiscordSettings();
  });

  ipcMain.handle("discord:save-discord-settings", async (event, settings) => {
    void event;
    return saveDiscordSettings(settings);
  });

  ipcMain.handle("discord:test-discord-rpc", async () => {
    await connectDiscordRPC();
    return getDiscordRPCStatus();
  });

  ipcMain.handle("discord:test-discord-rpc-disconnect", async () => {
    disconnectDiscordRPC();
    return getDiscordRPCStatus();
  });

  ipcMain.handle(
    "discord:start-discord-song-rpc",
    async (event, songId: string) => {
      void event;
      await setDiscordSongRPCActivity(songId);
    },
  );

  ipcMain.handle("discord:stop-discord-song-rpc", async () => {
    await stopDiscordSongRPC();
  });
};
