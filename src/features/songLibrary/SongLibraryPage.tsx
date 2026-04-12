import { useState } from "react";
import SongList from "./SongList";
import SongDetails from "./SongDetails";

type Song = {
  title: string;
  artist: string;
};

export default function SongLibraryPage() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const songs = [
    { title: "Awakening", artist: "Ichika Nito" },
    { title: "Illusory Sense", artist: "Ichika Nito" },
    { title: "He Waits Patiently", artist: "Ichika Nito" },
  ];
  return (
    <section className="song-library-layout">
      <aside className="song-list-panel">
        <h2>Song Library</h2>
        <SongList songs={songs} onSelectSong={setSelectedSong} />
      </aside>

      <main className="song-detail-panel">
        <h2>Song Details</h2>
        {selectedSong ? (
          <SongDetails song={selectedSong} />
        ) : (
          <p>Select a song.</p>
        )}
      </main>
    </section>
  );
}
