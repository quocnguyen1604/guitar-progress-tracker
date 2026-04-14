import type { Song } from "../../../shared/types/song";
import SongDetailsView from "./songDetailsView";
import SongDetailsEditForm from "./SongDetailsEditForm";
import { useState, useEffect } from "react";

type SongDetailsProp = {
  song: Song;
};

export default function SongDetails({ song }: SongDetailsProp) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRPCActive, setIsRPCActive] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [song.id]);

  const startDiscordSongRPC = async () => {
    await window.discordApi.startDiscordSongRPC(song.id);
    setIsRPCActive(true);
  };

  const stopDiscordSongRPC = async () => {
    await window.discordApi.stopDiscordSongRPC();
    setIsRPCActive(false);
  };

  return (
    <div>
      {isEditing ? (
        <SongDetailsEditForm song={song} setIsEditing={setIsEditing} />
      ) : (
        <SongDetailsView song={song} setIsEditing={setIsEditing} />
      )}
      {isRPCActive ? (
        <button onClick={() => stopDiscordSongRPC()}>Stop Discord RPC</button>
      ) : (
        <button onClick={() => startDiscordSongRPC()}>Start Discord RPC</button>
      )}
    </div>
  );
}
