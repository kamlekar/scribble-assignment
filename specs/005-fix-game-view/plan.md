# Implementation Plan: Game View Transition

**Branch**: `005-fix-game-view` | **Date**: 2026-06-09 | **Spec**: `specs/005-fix-game-view/spec.md`

**Input**: Feature specification from `specs/005-fix-game-view/spec.md`

## Summary

When the host starts a game, all participants in the lobby must be redirected to the game page. Currently, only the host navigates (via the start-game button handler). This fix adds status-change detection to the lobby polling loop so participants auto-redirect when `room.status` transitions from `"lobby"` to `"playing"`. Additionally, latecomers and refreshers are routed to the correct page based on room status.

## Technical Context

**Language/Version**: TypeScript (ES2022+), Node.js 24.13 (from `.nvmrc`)

**Primary Dependencies**: Express 4, React 18, React Router 6, Zod 3

**Storage**: In-memory (`Map<string, Room>` in `backend/src/services/roomStore.ts`)

**Testing**: Vitest (both backend `vitest.config.ts` and frontend `vitest.config.ts`)

**Target Platform**: Web browser (Chrome/Firefox/Safari) + Node.js server

**Project Type**: Web application (Express backend + React SPA frontend)

**Performance Goals**: Room status polled every 2 seconds; redirect must occur within one poll cycle (~2s) after status change

**Constraints**: No WebSockets, no databases, no auth. All sync via HTTP polling. In-memory state only (lost on restart). Frontend state via custom `RoomStore` class + React Context + `useSyncExternalStore`.

**Scale/Scope**: Single-room games with 2-10 participants. No multi-room scalability requirements.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Rationale |
|------|--------|-----------|
| **I. TypeScript Strictness** | ✅ PASS | All existing code is typed; new changes follow same patterns, use Zod for validation |
| **II. Brownfield Enhancement** | ✅ PASS | Changes are additive to existing `LobbyPage`, `GamePage`, `roomStore`; no rewrites |
| **III. HTTP Polling — No WebSockets** | ✅ PASS | Uses existing 2-second polling; no real-time protocol introduced |
| **IV. In-Memory State — No Database** | ✅ PASS | No storage changes needed; status transitions already in `roomStore.ts` |
| **V. Incremental & Verifiable Delivery** | ✅ PASS | Each acceptance scenario independently testable; Given/When/Then format used |
| **Technology Stack Match** | ✅ PASS | All project deps unchanged; no new libraries |
| **Out-of-Scope Check** | ✅ PASS | Does not touch rounds/timers/scoring/spectator mode |

**Result**: All gates pass. No violations to track in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/005-fix-game-view/
├── plan.md              # This file
├── research.md          # Phase 0 — technical research
├── data-model.md        # Phase 1 — entity definitions
├── quickstart.md        # Phase 1 — validation guide
└── contracts/           # Phase 1 — API contracts
    └── api.md
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── pages/
│   │   ├── LobbyPage.tsx    # MAJOR: add status-change redirect on poll + mount-time check
│   │   ├── GamePage.tsx     # MAJOR: add status validation + redirects + finished display
│   │   └── JoinRoomPage.tsx # No change needed (already handles "game in progress")
│   └── state/
│       └── roomStore.ts     # No change needed (existing pollRoom + useSyncExternalStore sufficient)

backend/                      # No changes needed — API already returns status: "playing"
```

**Structure Decision**: Web application (Option 2). Backend `api/` routes handle HTTP endpoints; frontend `pages/` handle view logic; `state/roomStore.ts` manages client-side state.

## Complexity Tracking

No constitutional violations. All changes are additive and justified by the feature spec.
