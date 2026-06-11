# Data Model — Game View Transition

## Introduction

This feature does not introduce new entities or storage. It adds **state-transition-aware routing rules** to existing pages. The relevant existing entities are documented below with the navigation rules they drive.

## Existing Entities

### Room

Defined in `backend/src/models/game.ts`:

| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` | 4-char alphanumeric code |
| `hostId` | `string` | Participant ID of the host |
| `status` | `"lobby" \| "playing" \| "finished"` | Current room phase |
| `participants` | `Participant[]` | Array of participants |
| `word` | `string \| undefined` | Selected word (set when game starts) |
| `createdAt` | `string` (ISO 8601) | Room creation timestamp |
| `updatedAt` | `string` (ISO 8601) | Last update timestamp |

### Participant (within Room)

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` (UUID) | Unique participant identifier |
| `name` | `string` | Display name (1-30 chars) |
| `joinedAt` | `string` (ISO 8601) | Join timestamp |
| `role` | `"drawer" \| "guesser" \| undefined` | Assigned when game starts |

### RoomSnapshot (API response)

Defined in `backend/src/services/roomStore.ts` (`toRoomSnapshot`) and `frontend/src/services/api.ts`:

| Field | Type | Notes |
|-------|------|-------|
| `code` | `string` | |
| `status` | `"lobby" \| "playing" \| "finished"` | Primary signal for navigation |
| `participants` | `ParticipantSnapshot[]` | Includes `role` only when `status !== "lobby"` |
| `hostId` | `string` | |
| `word` | `string \| undefined` | Only present for drawer when `status === "playing"` |
| `availableWords` | `string[]` | All valid words |
| `roles` | `("drawer" \| "guesser")[]` | Valid role values |

## State Transitions

### Room Status Transitions

```
lobby ──[host starts game]──► playing ──[drawer disconnects]──► finished
  ▲                                                               │
  └───────────────────[room deleted]──────────────────────────────┘
```

### Page Routing by Status

| Current Page | `room.status` | Action |
|-------------|---------------|--------|
| LobbyPage | `"lobby"` | Stay, display lobby UI |
| LobbyPage | `"playing"` | `navigate("/game")` |
| LobbyPage | `"finished"` | `navigate("/")` |
| GamePage | `"playing"` | Stay, display game UI |
| GamePage | `"lobby"` | `navigate("/lobby")` |
| GamePage | `"finished"` | Stay, display "game ended" message |
| JoinRoomPage | `"playing"` (join rejected) | Show "Game already in progress" error |

## Validation Rules

- **FR-001**: Redirect on status → `"playing"` must be triggered by every poll cycle, not just the host's start action
- **FR-002**: The 2-second poll interval already satisfies the sub-3-second requirement (no change needed)
- **FR-003**: `participantId` and `room.code` are already persisted in `RoomStore` state — no additional persistence needed
- **FR-004**: Role is already returned in snapshots when `status === "playing"` — GamePage already displays it
- **FR-005**: LobbyPage on mount must check `room.status` — if `"playing"`, redirect immediately (handles refresh)
- **FR-006**: GamePage on mount must check `room.status` — if `"lobby"`, redirect to lobby; if `"finished"`, display end message
- **FR-008**: GamePage when `status === "finished"` must show game-ended message
