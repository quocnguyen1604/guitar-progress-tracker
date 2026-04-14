# Development Guide

This guide is for contributors and maintainers of Guitar Progress Tracker.

## Stack

- Electron (main process + preload bridge)
- React + Vite (renderer)
- TypeScript
- SQLite via better-sqlite3
- React Hook Form + Zod

## Prerequisites

- Node.js 20+
- npm 10+
- Windows (required for NSIS installer generation)

## Project Structure

```text
electron/
  ipc/
  services/
  main.ts
  preload.cjs
src/
  features/
    songLibrary/
    discord/
  App.tsx
  main.tsx
build/
  installer-license.txt
```

## Setup

Install dependencies:

```bash
npm install
```

## Development Workflow

Run the full app in development mode:

```bash
npm run dev
```

This starts:

- Vite dev server for renderer
- TypeScript watch build for Electron main process
- Electron process connected to local renderer

## Scripts

- npm run dev: full local development workflow
- npm run lint: run ESLint
- npm run test: run Vitest once
- npm run build: build renderer
- npm run build:electron: compile Electron TypeScript
- npm run build:app: build renderer + Electron
- npm run pack:win: create unpacked app in release/win-unpacked
- npm run dist:win: build NSIS installer in release/
- npm run release:check: lint + test + build:app

## Packaging

Build unpacked app:

```bash
npm run pack:win
```

Build installer:

```bash
npm run dist:win
```

Expected outputs:

- release/win-unpacked/
- release/Guitar Progress Tracker-Setup-<version>.exe
- release/Guitar Progress Tracker-Setup-<version>.exe.blockmap

## Git Flow Recommendation

1. Develop features on feature/\* branches.
2. Merge into develop.
3. Cut release/\* from develop.
4. Apply release-only fixes/docs/version updates on release branch.
5. Merge release branch into main and tag version.
6. Merge main back into develop.

## Release to GitHub

1. Run installer build:

```bash
npm run dist:win
```

2. Tag and push:

```bash
git tag -a v0.1.0 -m "v0.1.0"
git push origin v0.1.0
```

3. In GitHub Releases:

- Draft release from tag
- Upload installer artifacts from release/
- Publish release
