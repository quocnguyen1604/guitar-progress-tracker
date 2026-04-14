import { useState, useEffect } from "react";
import SongList from "./components/SongList";
import SongDetails from "./components/SongDetails";
import type { Song } from "../../shared/types/song";
import pageStyles from "./SongLibraryPage.module.css";
import uiStyles from "../../shared/styles/ui.module.css";

export default function SongLibraryPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
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

  const selectedSong = songs.find((song) => song.id === selectedSongId) || null;

  return (
    <section className={pageStyles.layout}>
      <aside className={pageStyles.panel}>
        <h2 className={pageStyles.panelTitle}>Song Library</h2>
        <div className={pageStyles.listActions}>
          <button className={uiStyles.button} onClick={handleOpenAddSongWindow}>
            Add Song
          </button>
        </div>
        <SongList
          songs={songs}
          onSelectSong={setSelectedSongId}
          className={pageStyles.songList}
        />
      </aside>

      <main className={pageStyles.panel}>
        <h2 className={pageStyles.panelTitle}>Song Details</h2>
        {selectedSong ? (
          <SongDetails song={selectedSong} />
        ) : (
          <p className={pageStyles.emptyState}>Select a song.</p>
        )}
      </main>
    </section>
  );
}
