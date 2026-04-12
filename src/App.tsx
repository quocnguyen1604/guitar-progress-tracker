import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SongLibraryPage from "./features/songLibrary/SongLibraryPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Guitar Progress Tracker</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/songlibrary" replace />} />
          <Route path="/songlibrary" element={<SongLibraryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
