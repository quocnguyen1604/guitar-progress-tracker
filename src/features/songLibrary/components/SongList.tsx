import SongListItem from "./SongListItem";
import type { Song } from "../../../shared/types/song";

type SongListProps = {
  songs: Song[];
  onSelectSong: (song: Song) => void;
};

export default function SongList({ songs, onSelectSong }: SongListProps) {
  return (
    <div>
      {songs.map((song) => (
        <SongListItem
          key={song.title}
          song={song}
          onClick={() => onSelectSong(song)}
        />
      ))}
    </div>
  );
}
