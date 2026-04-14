import { app, safeStorage } from "electron";
import path from "node:path";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";

export function saveDiscordSettings({
  applicationId,
  iconUpdateInterval,
  botToken,
}: {
  applicationId: string;
  iconUpdateInterval: number;
  botToken?: string;
}): boolean {
  if (!safeStorage.isEncryptionAvailable()) {
    console.warn(
      "Encryption is not available on this system. Bot token cannot be securely stored.",
    );
    return false;
  }
  const encryptedBotToken = botToken
    ? safeStorage.encryptString(botToken).toString("base64")
    : undefined;
  try {
    const settings = {
      applicationId,
      iconUpdateInterval,
      botToken: encryptedBotToken,
    };
    const settingsJson = JSON.stringify(settings, null, 2);
    const configDir = path.join(
      app.getPath("userData"),
      "guitar-progress-tracker",
    );
    const configFilePath = path.join(configDir, "discordSettings.json");
    mkdirSync(configDir, { recursive: true });
    writeFileSync(configFilePath, settingsJson);
    return true;
  } catch (error) {
    console.error("Failed to save Discord settings:", error);
    return false;
  }
}

export function loadDiscordSettings(): {
  applicationId: string;
  iconUpdateInterval: number;
} | null {
  const appDataPath = app.getPath("userData");
  const configFilePath = path.join(
    appDataPath,
    "/guitar-progress-tracker/discordSettings.json",
  );
  try {
    if (!safeStorage.isEncryptionAvailable()) {
      console.warn(
        "Encryption is not available on this system. Bot token cannot be securely stored.",
      );
      return {
        applicationId: "",
        iconUpdateInterval: 60,
      };
    }
    if (!existsSync(configFilePath)) {
      return {
        applicationId: "",
        iconUpdateInterval: 60,
      };
    }
    const config = JSON.parse(readFileSync(configFilePath, "utf-8"));
    return {
      applicationId: config.applicationId,
      iconUpdateInterval: config.iconUpdateInterval,
    };
  } catch (error) {
    console.error("Failed to load Discord settings:", error);
    return null;
  }
}

export const getDecryptedBotToken = (): string | null => {
  const appDataPath = app.getPath("userData");
  const configFilePath = path.join(
    appDataPath,
    "/guitar-progress-tracker/discordSettings.json",
  );
  try {
    if (!safeStorage.isEncryptionAvailable()) {
      console.warn(
        "Encryption is not available on this system. Bot token cannot be securely stored.",
      );
      return null;
    }
    const config = JSON.parse(readFileSync(configFilePath, "utf-8"));
    if (config.botToken) {
      return safeStorage.decryptString(Buffer.from(config.botToken, "base64"));
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to load Discord settings:", error);
    return null;
  }
};

export const updateDiscordApplicationAvatar = async (
  avatarPath: string | undefined,
): Promise<void> => {
  if (!avatarPath) {
    console.warn("No avatar path provided. Skipping avatar update.");
    return;
  }
  const botToken = getDecryptedBotToken();
  if (!botToken) {
    console.warn(
      "Bot token is not available. Cannot update application avatar.",
    );
    return;
  }
  if (!existsSync(avatarPath)) {
    console.warn("Avatar file not found. Cannot update application avatar.");
    return;
  }

  const ext = path.extname(avatarPath).slice(1).toLowerCase();

  const mimeTypeMap: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
  };

  const mimeType = mimeTypeMap[ext];
  if (!mimeType) {
    console.warn(`Unsupported avatar extension: .${ext}`);
    return;
  }

  const avatarData = readFileSync(avatarPath).toString("base64");
  const avatarDataUri = `data:${mimeType};base64,${avatarData}`;

  try {
    const response = await fetch(
      `https://discord.com/api/v10/applications/@me`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          icon: avatarDataUri,
        }),
      },
    );
    if (!response.ok) {
      console.error(
        `Failed to update Discord application avatar: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error("Failed to update application avatar:", error);
  }
};
