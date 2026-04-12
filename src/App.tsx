import { useEffect, useState } from "react";
import "./App.css";

type AppStatus = {
  mode: "development" | "production";
  electron: string;
  node: string;
  chrome: string;
};

function App() {
  const [status, setStatus] = useState<AppStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.appApi) {
      setError(
        "Electron preload bridge is not available. Start the app with npm run dev.",
      );
      return;
    }

    window.appApi
      .getStatus()
      .then(setStatus)
      .catch(() =>
        setError("Unable to read app status from Electron main process."),
      );
  }, []);

  return (
    <main className="shell">
      <h1>Guitar Progress Tracker</h1>
      <p className="subtitle">Electron + React + TypeScript setup is ready.</p>

      {error && <p className="error">{error}</p>}

      {status && (
        <section className="status-grid" aria-label="Environment status">
          <article className="card">
            <h2>Mode</h2>
            <p>{status.mode}</p>
          </article>
          <article className="card">
            <h2>Electron</h2>
            <p>{status.electron}</p>
          </article>
          <article className="card">
            <h2>Node.js</h2>
            <p>{status.node}</p>
          </article>
          <article className="card">
            <h2>Chromium</h2>
            <p>{status.chrome}</p>
          </article>
        </section>
      )}

      <section className="next-steps">
        <h2>Next Steps</h2>
        <ol>
          <li>
            Define SQLite schema and song CRUD handlers in Electron main
            process.
          </li>
          <li>Build song library list and editor UI in React.</li>
          <li>Add Discord Rich Presence service and wire updates over IPC.</li>
        </ol>
      </section>
    </main>
  );
}

export default App;
