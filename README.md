# Guitar Progress Tracker

Desktop app foundation for a local-first guitar song tracker with Discord Rich Presence.

## Stack

- Electron (main process + preload bridge)
- React + Vite (renderer)
- TypeScript
- SQLite (`better-sqlite3`)
- Discord RPC (`discord-rpc`)

## Project Layout

```text
electron/
  main.ts
  preload.ts
src/
  App.tsx
  main.tsx
  shared/
    types/
tsconfig.electron.json
```

## Setup

Install dependencies:

```bash
npm install
```

Run the desktop app in development:

```bash
npm run dev
```

This starts:

- Vite dev server for the renderer
- TypeScript build for Electron main/preload
- Electron app window pointed at the Vite URL

## Build Commands

Build renderer only:

```bash
npm run build
```

Build Electron only:

```bash
npm run build:electron
```

Build both:

```bash
npm run build:app
```

Run built Electron app:

```bash
npm run start
```

## Next Implementation Targets

1. Add SQLite schema and song CRUD IPC handlers.
2. Build song library UI and song editor form.
3. Add Discord Rich Presence service with idle status.
