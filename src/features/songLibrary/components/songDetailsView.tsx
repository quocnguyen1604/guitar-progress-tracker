import type { Song } from "../../../shared/types/song";
import styles from "./SongDetails.module.css";
import uiStyles from "../../../shared/styles/ui.module.css";
import { useEffect, useState } from "react";

type SongDetailsProp = {
  song: Song;
  setIsEditing: (isEditing: boolean) => void;
};

export default function SongDetailsView({
  song,
  setIsEditing,
}: SongDetailsProp) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  useEffect(() => {
    let imageUrl: string | null = null;
    let cancelled = false;

    const loadThumbnail = async () => {
      if (!song.thumbnailPath) {
        setImageSrc(null);
        return;
      }

      try {
        const thumbnailData = await window.songApi.getSongThumbnail(
          song.thumbnailPath,
        );
        if (!thumbnailData || cancelled) {
          setImageSrc(null);
          return;
        }
        const { bytes, mimeType } = thumbnailData;
        const safeBytes = new Uint8Array(bytes).slice();
        const blob = new Blob([safeBytes], { type: mimeType });
        imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error loading thumbnail:", error);
        setImageSrc(null);
      }
    };

    void loadThumbnail();

    return () => {
      cancelled = true;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [song.id, song.thumbnailPath]);

  return (
    <div className={styles.card}>
      <div className={styles.detailsLayout}>
        <div className={styles.infoBlock}>
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
        </div>
        {imageSrc && (
          <div className={styles.thumbnailBlock}>
            <img
              src={imageSrc}
              alt={`${song.title} thumbnail`}
              className={styles.thumbnail}
            />
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <button className={uiStyles.button} onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button
          className={`${uiStyles.button} ${uiStyles.dangerButton}`}
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this song?")) {
              void window.songApi.deleteSong(song.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
