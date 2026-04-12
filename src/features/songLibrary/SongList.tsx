import SongListItem from "./SongListItem";

type SongListItemProps = {
  title: string;
  artist: string;
};

export default function SongList({ songs }: { songs: SongListItemProps[] }) {
  return (
    <div>
      <h2>Song List</h2>
      <p>This is where the list of songs will be displayed.</p>
      {songs.map((song) => (
        <SongListItem key={song.title} song={song} />
      ))}
    </div>
  );
}
