type SongListItemProps = {
  title: string;
  artist: string;
};

export default function SongListItem({ song }: { song: SongListItemProps }) {
  return (
    <div>
      <h3>{song.title}</h3>
      <p>{song.artist}</p>
    </div>
  );
}
