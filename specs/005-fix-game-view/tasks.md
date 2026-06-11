---

description: "Task list for Game View Transition feature"

---

# Tasks: Game View Transition

**Input**: Design documents from `specs/005-fix-game-view/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated tests requested — manual validation per quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`
- **Frontend**: `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization (SKIP — brownfield project; all infrastructure exists)

No setup tasks needed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure (SKIP — no new infrastructure; changes are additive to existing code)

No foundational tasks needed.

---

## Phase 3: User Story 1 — All Players See Game View on Start (Priority: P1) 🎯 MVP

**Goal**: When the host starts the game, every participant currently in the lobby — including the host — transitions from the lobby page to the game page via status-change detection in the polling loop. No participant remains stuck on the lobby after the game has started. The game page displays each participant's role on first load.

**Independent Test**: Open two browser windows in the same room. Host clicks "Start Game". Both windows navigate to `/game` within 3 seconds. Both show the participant's role ("drawer" or "guesser").

### Implementation for User Story 1

- [ ] T001 [P] [US1] Add status-change detection in LobbyPage polling at `frontend/src/pages/LobbyPage.tsx` — in the existing interval `useEffect` that calls `roomStore.pollRoom()`, add a check after each render where `room` is present: if `room.status === "playing"`, call `navigate("/game", { replace: true })`; if `room.status === "finished"`, call `navigate("/", { replace: true })`; if poll fails, show a non-blocking error indicator (e.g., "Connection issue...") that auto-clears on next successful poll
- [ ] T002 [P] [US1] Add GamePage status validation on mount at `frontend/src/pages/GamePage.tsx` — add a `useEffect` keyed on `[navigate, room]` that checks: if `!room` or `room.status === "finished"` (room already ended before navigation), navigate to `/`; if `room.status === "lobby"`, navigate to `/lobby`; if `room.status === "playing"`, render the game UI normally (role display already works via existing code)
- [ ] T003 [US1] Verify both builds pass — run `cd backend && npm run build && cd ../frontend && npm run build`

**Checkpoint**: MVP complete — two-window test passes (both host and participant redirected to game page within 3 seconds).

---

## Phase 4: User Story 2 — Game Page State for Latecomers (Priority: P2)

**Goal**: A participant who refreshes their lobby page, returns after navigating away, or who is on the game page when the game ends correctly transitions to the appropriate view.

**Independent Test**: Open a room as host in window A. Join as participant in window B. Start game from window A. Navigate back to `/lobby` in window B — verify redirect to `/game`. Hard-refresh window B's lobby page — verify redirect to `/game`. End the game — verify window B shows "The round has ended" message.

### Implementation for User Story 2

- [ ] T004 [US2] Add LobbyPage mount-time status check at `frontend/src/pages/LobbyPage.tsx` — in the existing mount `useEffect` that checks `if (!room) navigate("/")`, also check if `room.status === "playing"` and navigate to `/game`, or if `room.status === "finished"` and navigate to `/`; this runs before the polling interval is set up, handling returning participants who navigate back to `/lobby` during an active game
- [ ] T005 [US2] Add GamePage poll-based transition detection at `frontend/src/pages/GamePage.tsx` — in the existing polling `useEffect`, after each poll cycle check if `room.status` transitioned to `"finished"` and show "The round has ended" message via `useState` flag instead of the active game UI; if status transitioned to `"lobby"`, navigate to `/lobby`
- [ ] T006 [US2] Verify both builds pass — run `cd backend && npm run build && cd ../frontend && npm run build`

**Checkpoint**: Latecomer scenarios verified — participants navigating back to lobby or refreshing during an active game are redirected correctly; game-end transition shows end message.

---

## Phase 5: Polish & Edge Cases

**Purpose**: Handle remaining edge cases and run full validation.

- [ ] T007 [P] Verify missing-session redirect at `frontend/src/pages/LobbyPage.tsx` and `frontend/src/pages/GamePage.tsx` — confirm the existing `if (!room) navigate("/")` guards redirect users to the join page when the session is missing or expired (per FR-006); no code change expected
- [ ] T008 [P] Verify "Game already in progress" error at `frontend/src/pages/JoinRoomPage.tsx` — confirm the existing catch block surfaces the 400 error from `POST /rooms/:code/join` when the room status is `"playing"` (per FR-007); no code change expected
- [ ] T009 Run full manual validation per `specs/005-fix-game-view/quickstart.md` — execute all 5 validation scenarios and confirm each passes (requires two browser windows)
- [ ] T010 Final build verification — run `cd backend && npm run build && cd ../frontend && npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Not applicable — skip
- **Foundational (Phase 2)**: Not applicable — skip
- **US1 (Phase 3)**: No dependencies — can start immediately
- **US2 (Phase 4)**: T004 modifies the same file as T001 — apply after T001 to avoid merge conflicts. T005 (GamePage polling) is independent and can run in parallel with US1
- **Polish (Phase 5)**: Depends on US1 and US2 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies — can be implemented and tested independently
- **User Story 2 (P2)**: T004 depends on T001 (same file LobbyPage.tsx), but the stories are functionally independent

### Within Each Phase

- [P] tasks can run in parallel (different files, no cross-dependencies)
- Non-[P] tasks must run sequentially
- Build verification runs last within each phase

### Parallel Opportunities

- T001 (LobbyPage polling) and T002 (GamePage mount check) can run in parallel — different files, no dependencies
- T004 must follow T001 — same file (LobbyPage.tsx), sequential to avoid conflicts
- T005 can run in parallel with T004 — different files (GamePage.tsx vs LobbyPage.tsx)
- T007 and T008 can run in parallel — verification-only, different files
- All [P]-marked tasks within a phase can run simultaneously

---

## Parallel Example: User Story 1

```bash
# Launch T001 and T002 together (different files):
Task: "Add status-change detection in LobbyPage polling at frontend/src/pages/LobbyPage.tsx"
Task: "Add GamePage status validation on mount at frontend/src/pages/GamePage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1 (T001, T002, T003)
2. **STOP and VALIDATE**: Run two-browser manual test per quickstart.md Scenario 1
3. Deliver — core bug fix is complete

### Incremental Delivery

1. Complete User Story 1 → Validate independently → Deliver (MVP!)
2. Complete User Story 2 → Validate independently → Deliver
3. Complete Polish → Final validation → Deliver

### Notes

- No backend changes needed — the API already returns `status: "playing"` in room snapshots
- No new state management methods needed — existing `pollRoom()` + `useSyncExternalStore` provides reactive room state
- No new dependencies needed — all changes use existing React Router `useNavigate` and React hooks
- LobbyPage.tsx is modified by both T001 (US1) and T004 (US2) — apply sequentially to avoid conflicts
- GamePage.tsx is modified by both T002 (US1) and T005 (US2) — handle finished state consistently; T005 builds on T002's foundation
- Each phase should be independently verifiable via manual testing per quickstart.md
- Build (`npm run build`) must pass on both backend and frontend before phase completion
- Per constitution Principle V: commits must be granular and traceable to the spec
