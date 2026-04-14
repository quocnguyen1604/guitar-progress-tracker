import type { Song } from "../../../shared/types/song";
import styles from "./SongDetails.module.css";
import uiStyles from "../../../shared/styles/ui.module.css";

type SongDetailsProp = {
  song: Song;
  setIsEditing: (isEditing: boolean) => void;
};

export default function SongDetailsView({
  song,
  setIsEditing,
}: SongDetailsProp) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{song.title}</h2>
      <p className={styles.subtitle}>{song.artist}</p>
      <p className={styles.meta}>
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
      <p className={styles.meta}>
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
      <p className={styles.metric}>Target BPM: {song.targetBpm}</p>
      <p className={styles.metric}>
        Current Practice BPM: {song.currentPracticeBpm}
      </p>
      <p className={styles.metric}>Progress: {song.progress}%</p>
      {song.notes && <p className={styles.metric}>Notes: {song.notes}</p>}
      <div className={styles.actions}>
        <button className={uiStyles.button} onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </div>
    </div>
  );
}
