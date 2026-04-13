import type { Song } from "../../../shared/types/song";

type SongDetailsProp = {
  song: Song;
};

export default function SongDetails({ song }: SongDetailsProp) {
  return (
    <div>
      <h2>{song.title}</h2>
      <p>{song.artist}</p>
    </div>
  );
}
