import type { Song } from "../../../shared/types/song";
import SongDetailsView from "./songDetailsView";
import SongDetailsEditForm from "./SongDetailsEditForm";
import { useState } from "react";
import styles from "./SongDetails.module.css";
import uiStyles from "../../../shared/styles/ui.module.css";

type SongDetailsProp = {
  song: Song;
};

export default function SongDetails({ song }: SongDetailsProp) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRPCActive, setIsRPCActive] = useState(false);

  const startDiscordSongRPC = async () => {
    await window.discordApi.startDiscordSongRPC(song.id);
    setIsRPCActive(true);
  };

  const stopDiscordSongRPC = async () => {
    await window.discordApi.stopDiscordSongRPC();
    setIsRPCActive(false);
  };

  return (
    <div className={styles.container}>
      {isEditing ? (
        <SongDetailsEditForm song={song} setIsEditing={setIsEditing} />
      ) : (
        <SongDetailsView song={song} setIsEditing={setIsEditing} />
      )}
      {isRPCActive ? (
        <button
          className={`${uiStyles.button} ${styles.rpcStop}`}
          onClick={() => stopDiscordSongRPC()}
        >
          Stop Discord RPC
        </button>
      ) : (
        <button
          className={uiStyles.button}
          onClick={() => startDiscordSongRPC()}
        >
          Start Discord RPC
        </button>
      )}
    </div>
  );
}
