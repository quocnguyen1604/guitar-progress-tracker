import SongListItem from "./SongListItem";
import type { Song } from "../../../shared/types/song";

type SongListProps = {
  songs: Song[];
  onSelectSong: (song: string) => void;
  className?: string;
};

export default function SongList({
  songs,
  onSelectSong,
  className,
}: SongListProps) {
  return (
    <div className={className}>
      {songs.map((song) => (
        <SongListItem
          key={song.id}
          song={song}
          onClick={() => onSelectSong(song.id)}
        />
      ))}
    </div>
  );
}
