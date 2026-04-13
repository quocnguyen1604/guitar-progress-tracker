import type { Song } from "../../../shared/types/song";

type SongDetailsProp = {
  song: Song;
  setIsEditing: (isEditing: boolean) => void;
};

export default function SongDetailsView({
  song,
  setIsEditing,
}: SongDetailsProp) {
  return (
    <div>
      <h2>{song.title}</h2>
      <p>{song.artist}</p>
      <p>
        Added on:{" "}
        {new Date(song.createdAt).toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </p>
      <p>
        Last updated:{" "}
        {new Date(song.updatedAt).toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </p>
      <p>Target BPM: {song.targetBpm}</p>
      <p>Current Practice BPM: {song.currentPracticeBpm}</p>
      <p>Progress: {song.progress}%</p>
      {song.notes && <p>Notes: {song.notes}</p>}
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </div>
  );
}
