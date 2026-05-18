# Drawing Game Starter

This repository contains a starter drawing-game project split into:

- `frontend/`: Vite + React + TypeScript client
- `backend/`: Node.js + Express + TypeScript service

## Prerequisites

- Node.js 20.x
- npm 10.x or newer

## Run the backend

```bash
cd backend
npm install
npm run dev
```

The backend starts on `http://localhost:3001`.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

## First-run checklist

1. Start the backend and confirm `http://localhost:3001/health` returns `{ "ok": true }`.
2. Start the frontend and open `http://localhost:5173`.
3. Confirm the Start screen shows `Create Room` and `Join Room` entry actions.

## Troubleshooting

- If the frontend cannot reach the backend, verify the backend is running on port `3001`.
- If the backend port is already in use, start it with `PORT=<new-port> npm run dev`.
- If TypeScript or Vite commands are missing, rerun `npm install` inside the relevant app directory.

## Current implementation scope

This starter intentionally stops at the clarified assignment scope.

Out of scope for this implementation:

- host behavior, host-only permissions, and dedicated host controls
- strict room acceptance criteria from the rejected alternate requirement set
- strict game acceptance criteria from the rejected alternate requirement set
- persistent storage, multi-process state sharing, or websocket-based real-time sync
- production-grade auth, anti-cheat rules, or hardened multiplayer security
- drawing tools beyond the visible canvas placeholder

## Manual verification

Use this flow to verify the implemented starter matches the active spec:

1. Open the Start screen.
2. Create a room and confirm you land in the Lobby screen.
3. Join the same room from another tab or session.
4. Refresh the Lobby and confirm the participant list reflects the latest room snapshot.
5. Open the Game screen and confirm the canvas, guess input, scoreboard, and result placeholders are visible.

## Validation notes

- Backend state is intentionally in-memory only; restarting the backend clears all rooms and sessions.
- Local builds should complete before runtime verification: `cd backend && npm run build` and `cd frontend && npm run build`.
