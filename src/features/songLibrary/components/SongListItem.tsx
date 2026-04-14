import type { Song } from "../../../shared/types/song";
import styles from "./SongListItem.module.css";

type SongListItemProps = {
  song: Song;
  onClick: () => void;
};

export default function SongListItem({ song, onClick }: SongListItemProps) {
  return (
    <button type="button" onClick={onClick} className={styles.songButton}>
      <h3 className={styles.title}>{song.title}</h3>
      <p className={styles.artist}>{song.artist}</p>
    </button>
  );
}
