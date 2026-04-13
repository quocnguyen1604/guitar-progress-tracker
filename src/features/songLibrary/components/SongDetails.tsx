import type { Song } from "../../../shared/types/song";
import SongDetailsView from "./songDetailsView";
import SongDetailsEditForm from "./SongDetailsEditForm";
import { useState, useEffect } from "react";

type SongDetailsProp = {
  song: Song;
};

export default function SongDetails({ song }: SongDetailsProp) {
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    setIsEditing(false);
  }, [song.id]);

  return (
    <div>
      {isEditing ? (
        <SongDetailsEditForm song={song} setIsEditing={setIsEditing} />
      ) : (
        <SongDetailsView song={song} setIsEditing={setIsEditing} />
      )}
    </div>
  );
}
