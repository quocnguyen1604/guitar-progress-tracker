import { useState, useEffect } from "react";
import SongList from "./components/SongList";
import SongDetails from "./components/SongDetails";
import type { Song } from "../../shared/types/song";

export default function SongLibraryPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songs = await window.songApi.getAllSongs();
        setSongs(songs);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      }
    };

    fetchSongs();
    const unsubscribe = window.songApi.onSongListUpdated(() => {
      void fetchSongs();
    });
    return () => unsubscribe();
  }, []);

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
