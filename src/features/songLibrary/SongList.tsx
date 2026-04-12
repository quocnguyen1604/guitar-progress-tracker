import SongListItem from "./SongListItem";

type Song = {
  title: string;
  artist: string;
};

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
