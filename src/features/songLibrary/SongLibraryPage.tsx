import SongList from "./SongList";

export default function SongLibraryPage() {
  const songs = [
    { title: "Awakening", artist: "Ichika Nito" },
    { title: "Illusory Sense", artist: "Ichika Nito" },
    { title: "He Waits Patiently", artist: "Ichika Nito" },
  ];
  return (
    <section className="song-library-layout">
      <aside className="song-list-panel">
        <h2>Song Library</h2>
        <p>Song list goes here</p>
        <SongList songs={songs} />
      </aside>

      <main className="song-detail-panel">
        <h2>Song Details</h2>
        <p>Select a song to view/edit details.</p>
      </main>
    </section>
  );
}
