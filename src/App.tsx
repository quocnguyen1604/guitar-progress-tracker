import { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SongLibraryPage from "./features/songLibrary/SongLibraryPage";
import AddSongPage from "./features/songLibrary/addSong/AddSongPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Guitar Progress Tracker</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/song-library" replace />} />
          <Route path="/song-library" element={<SongLibraryPage />} />
          <Route path="/add-song" element={<AddSongPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
