import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SongLibraryPage from "./features/songLibrary/SongLibraryPage";
import AddSongPage from "./features/songLibrary/addSong/AddSongPage";
import DiscordSettingPages from "./features/discord/discordSettingPages";
import styles from "./App.module.css";

function App() {
  return (
    <Router>
      <div className={styles.appShell}>
        <h1 className={styles.appTitle}>Guitar Progress Tracker</h1>
        <div className={styles.pageShell}>
          <Routes>
            <Route path="/" element={<Navigate to="/song-library" replace />} />
            <Route path="/song-library" element={<SongLibraryPage />} />
            <Route path="/add-song" element={<AddSongPage />} />
            <Route path="/discord-settings" element={<DiscordSettingPages />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
