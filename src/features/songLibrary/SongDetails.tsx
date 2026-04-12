type SongDetailsProps = {
  title: string;
  artist: string;
};

export default function SongDetails({ song }: { song: SongDetailsProps }) {
  return (
    <div>
      <h2>{song.title}</h2>
      <p>{song.artist}</p>
    </div>
  );
}
