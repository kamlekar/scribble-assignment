---

description: "Task list for Game View Transition feature"

---

# Tasks: Game View Transition

**Input**: Design documents from `specs/005-fix-game-view/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No automated tests requested. Manual validation per `quickstart.md`.

**Organization**: Tasks grouped by user story for independent validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization (SKIP — brownfield project; all infrastructure exists)

No setup tasks needed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure (SKIP — no new infrastructure; changes are additive to existing code)

No foundational tasks needed.

---

## Phase 3: User Story 1 — All Players See Game View on Start (Priority: P1) 🎯 MVP

**Goal**: When the host starts the game, every participant in the lobby transitions to the game page via status-change detection in the polling loop. The game page displays each participant's role.

**Independent Test**: Open two browser windows in the same room. Host clicks "Start Game". Both windows navigate to `/game` within 3 seconds. Both windows show the participant's role ("drawer" or "guesser").

### Implementation for User Story 1

- [X] T001 [P] [US1] Add status-change redirect to LobbyPage polling in `frontend/src/pages/LobbyPage.tsx` — add a `useEffect` that watches `room.status` and calls `navigate("/game")` when status transitions to `"playing"`; also add redirect to `/` when status is `"finished"`
- [X] T002 [P] [US1] Add GamePage status guards in `frontend/src/pages/GamePage.tsx` — on mount, if room status is `"lobby"`, navigate to `/lobby`; if status is `"finished"`, display a "Game has ended" message instead of the game UI; if status is `"playing"`, render normally (role display already works via existing code)
- [X] T003 [US1] Verify build passes — run `cd backend && npm run build && cd ../frontend && npm run build`

**Checkpoint**: MVP complete. Two-window test passes — both host and participant see game page after start.

---

## Phase 4: User Story 2 — Game Page State for Latecomers (Priority: P2)

**Goal**: A participant who refreshes their lobby page or whose tab was backgrounded during game start correctly transitions to the game page.

**Independent Test**: Join a room as a non-host. Host starts the game. Close and reopen the lobby page tab (SPA navigation, not hard refresh). Verify redirect to `/game`. Also verify that hard-refreshing the lobby page (which clears session) ends up at the join page.

### Implementation for User Story 2

- [X] T004 [P] [US2] Add LobbyPage mount-time status check in `frontend/src/pages/LobbyPage.tsx` — in the existing `useEffect` that checks `if (!room) navigate("/")`, also check if `room.status === "playing"` and redirect to `/game`, or if `room.status === "finished"` and redirect to `/`; this handles soft navigation back to lobby during an active game
- [X] T005 [US2] Verify build passes — run `cd backend && npm run build && cd ../frontend && npm run build`

**Checkpoint**: Latecomer scenarios verified — participants re-entering the lobby during a game are redirected correctly.

---

## Phase 5: Polish & Edge Cases

**Purpose**: Handle remaining edge cases and run full validation.

- [X] T006 [P] Handle "Game already in progress" error display in `frontend/src/pages/JoinRoomPage.tsx` — verify the existing catch block correctly surfaces the 400 error message from the backend; no code change expected (currently functional)
- [X] T007 Verify missing session redirect in `frontend/src/pages/GamePage.tsx` and `frontend/src/pages/LobbyPage.tsx` — confirm the existing `if (!room) navigate("/")` guards are sufficient for the "no session" edge case; no code change expected
- [ ] T008 Run full validation per `specs/005-fix-game-view/quickstart.md` — execute all 5 test scenarios and confirm each passes (MANUAL — requires two browser windows)
- [X] T009 Final build verification — run `cd backend && npm run build && cd ../frontend && npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Not applicable — skip
- **Foundational (Phase 2)**: Not applicable — skip
- **US1 (Phase 3)**: No dependencies — can start immediately
- **US2 (Phase 4)**: No dependencies on US1 — can run in parallel
- **Polish (Phase 5)**: Depends on US1 and US2 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies — can be implemented and tested independently
- **User Story 2 (P2)**: No dependencies on US1 — functionally independent (different page scenarios)

### Within Each Phase

- [P] tasks can run in parallel (different files, no cross-dependencies)
- Non-[P] tasks must run sequentially
- Build verification runs last within each phase

### Parallel Opportunities

- T001 (LobbyPage) and T002 (GamePage) can run in parallel — they modify different files
- T004 is a modification to LobbyPage (same file as T001) but addresses a different scenario — apply after T001 to avoid merge conflicts
- T005 (build check) must run after T004
- T006, T007, T008, T009 in Polish phase are verification-only tasks

---

## Parallel Example: User Story 1

```bash
# Launch T001 and T002 together (different files):
Task: "Add status-change redirect to LobbyPage polling in frontend/src/pages/LobbyPage.tsx"
Task: "Add GamePage status guards in frontend/src/pages/GamePage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1 (T001, T002, T003)
2. **STOP and VALIDATE**: Run two-browser manual test per `quickstart.md` Scenario 1
3. Deliver if ready — core bug fix is complete

### Incremental Delivery

1. Complete User Story 1 → Validate independently → Deliver (MVP!)
2. Complete User Story 2 → Validate independently → Deliver
3. Complete Polish → Final validation → Deliver

### Notes

- No backend changes needed — the API already returns `status: "playing"` in room snapshots
- No new state management methods needed — existing `pollRoom()` + `useSyncExternalStore` provides reactive room state
- [P] tasks = different files, no dependencies (but T001 and T004 modify the same file — apply sequentially)
- Each phase should be independently verifiable via manual testing
- Build (`npm run build`) must pass on both backend and frontend before phase completion
