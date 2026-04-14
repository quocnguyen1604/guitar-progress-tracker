import net from "node:net";
import {
  loadDiscordSettings,
  updateDiscordApplicationAvatar,
} from "./discord.js";
import { getSongById } from "./song.js";
import crypto from "node:crypto";

type DiscordRPCOpcode = 0 | 1 | 2 | 3 | 4;

type RPCClientState = {
  socket: net.Socket | null;
  clientId: string | null;
  connected: boolean;
};

const state: RPCClientState = {
  socket: null,
  clientId: null,
  connected: false,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDiscordRPCReady(
  timeoutMs: number = 3000,
  intervalMs: number = 50,
): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if (state.connected && state.socket && !state.socket.destroyed) {
      return true;
    }
    await sleep(intervalMs);
  }

  return false;
}

function encodeFrame(opcode: DiscordRPCOpcode, payload: unknown): Buffer {
  const payloadJson = Buffer.from(JSON.stringify(payload), "utf-8");
  const header = Buffer.alloc(8);
  header.writeUInt32LE(opcode, 0);
  header.writeUInt32LE(payloadJson.length, 4);
  return Buffer.concat([header, payloadJson]);
}

function decodeFrame(buffer: Buffer): {
  frames: Array<{ opCode: number; payload: unknown }>;
  consumedLength: number;
} {
  const frames: Array<{ opCode: number; payload: unknown }> = [];
  let offset = 0;

  while (offset + 8 <= buffer.length) {
    const opCode = buffer.readUInt32LE(offset);
    const length = buffer.readUInt32LE(offset + 4);
    if (offset + 8 + length > buffer.length) {
      break;
    }

    const raw = buffer
      .subarray(offset + 8, offset + 8 + length)
      .toString("utf-8");
    frames.push({
      opCode,
      payload: JSON.parse(raw),
    });
    offset += 8 + length;
  }

  return {
    frames,
    consumedLength: offset,
  };
}

async function connectPipe(): Promise<net.Socket> {
  for (let i = 0; i < 10; i++) {
    const pipePath = `\\\\.\\pipe\\discord-ipc-${i}`;
    try {
      const socket = await new Promise<net.Socket>((resolve, reject) => {
        const candidate = net.createConnection(pipePath, () => {
          candidate.removeListener("error", onError);
          resolve(candidate);
        });

        const onError = (error: Error) => {
          candidate.destroy();
          reject(error);
        };

        candidate.once("error", onError);
      });
      return socket;
    } catch {
      continue;
    }
  }

  throw new Error("Could not connect to Discord IPC pipe");
}

export async function connectDiscordRPC(): Promise<void> {
  if (state.connected && state.socket) return;

  const discordSettings = loadDiscordSettings();
  if (!discordSettings) {
    throw new Error("Discord settings not found");
  }

  const socket = await connectPipe();
  state.socket = socket;
  state.clientId = discordSettings.applicationId;

  let receiveBuffer = Buffer.alloc(0);

  socket.on("data", (data) => {
    receiveBuffer = Buffer.concat([receiveBuffer, data]);
    const { frames, consumedLength } = decodeFrame(receiveBuffer);

    for (const frame of frames) {
      const payload = frame.payload as { evt?: string };
      if (payload?.evt === "READY") {
        state.connected = true;
      }
    }

    if (consumedLength > 0) {
      receiveBuffer = receiveBuffer.subarray(consumedLength);
    }
  });

  socket.on("close", () => {
    state.socket = null;
    state.connected = false;
  });

  socket.on("error", () => {
    state.socket = null;
    state.connected = false;
  });

  const handshake = {
    v: 1,
    client_id: discordSettings.applicationId,
  };

  socket.write(encodeFrame(0, handshake));
}

export function getDiscordRPCStatus() {
  return {
    connected: state.connected,
    clientId: state.clientId,
  };
}

export function disconnectDiscordRPC() {
  if (state.socket) {
    state.socket.end();
    state.socket.destroy();
  }

  state.socket = null;
  state.connected = false;
  state.clientId = null;
}

export async function setDiscordSongRPCActivity(songId: string) {
  await connectDiscordRPC();
  const isReady = await waitForDiscordRPCReady();
  if (!isReady || !state.socket) {
    console.error("Discord RPC not ready");
    return;
  }

  console.log(`Setting Discord RPC activity for song id: ${songId}`);

  const song = getSongById(songId);
  if (!song) {
    console.error(`Song with id ${songId} not found`);
    return;
  }

  await clearDiscordRPCActivity();
  await updateDiscordApplicationAvatar(song.thumbnailPath);

  await sleep(5000);

  const activityPayload = {
    cmd: "SET_ACTIVITY",
    nonce: crypto.randomUUID(),
    args: {
      pid: process.pid,
      activity: {
        name: "Practicing Guitar",
        details: `Playing ${song.title}`,
        state: `by ${song.artist ?? "Unknown Artist"}`,
        timestamps: {
          start: Math.floor(Date.now() / 1000),
        },
        assets: {
          large_text: "Guitar Progress Tracker",
          small_text: "Practice Session",
        },
        buttons: [
          {
            label: "Want this?",
            url: "https://github.com/quocnguyen1604/guitar-progress-tracker",
          },
        ],
      },
    },
  };

  state.socket.write(encodeFrame(1, activityPayload));
}

export async function clearDiscordRPCActivity() {
  await connectDiscordRPC();
  const isReady = await waitForDiscordRPCReady();
  if (!isReady || !state.socket) {
    console.error("Discord RPC not ready");
    return;
  }

  const activityPayload = {
    cmd: "SET_ACTIVITY",
    nonce: crypto.randomUUID(),
    args: {
      pid: process.pid,
      activity: null,
    },
  };
  state.socket.write(encodeFrame(1, activityPayload));
}

export async function stopDiscordSongRPC() {
  await clearDiscordRPCActivity();
  disconnectDiscordRPC();
}
