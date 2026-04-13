import { useState } from "react";
import SongList from "./components/SongList";
import SongDetails from "./components/SongDetails";

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

  const handleOpenAddSongWindow = async () => {
    await window.appApi.openAddSongWindow();
  };

  return (
    <section className="song-library-layout">
      <aside className="song-list-panel">
        <h2>Song Library</h2>
        <button onClick={handleOpenAddSongWindow}>Add Song</button>
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
