type Song = {
  title: string;
  artist: string;
};

type SongListItemProps = {
  song: Song;
  onClick: () => void;
};

export default function SongListItem({ song, onClick }: SongListItemProps) {
  return (
    <button type="button" onClick={onClick}>
      <h3>{song.title}</h3>
      <p>{song.artist}</p>
    </button>
  );
}
