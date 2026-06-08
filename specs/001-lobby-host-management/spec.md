# Feature Specification: Lobby & Host Management

**Feature Branch**: `001-lobby-host-management`

**Created**: 2026-06-08

**Status**: Draft

**Input**: User description: "Create lobby management with host tracking, player validation, lobby polling, and host-only game start"

## Clarifications

### Session 2026-06-08

- Q: What happens when the host leaves the room? → A: Host role passes to the next player who joined earliest
- Q: Should duplicate player names be allowed? → A: Yes, duplicate names are allowed — no uniqueness enforcement

## User Scenarios & Testing

### User Story 1 - Host Creates and Manages Room (Priority: P1)

A player creates a room and is automatically recognised as the host. The host sees the lobby with their room code and can see other players joining. The host can start the game when ready.

**Why this priority**: Host designation is the foundation for all subsequent game actions (starting, drawer assignment). Without host tracking, no game can proceed.

**Independent Test**: Can be fully tested by creating a room and verifying the creator is designated as host, then having another player join and confirming the host remains unchanged.

**Acceptance Scenarios**:

1. **Given** no room exists, **When** a player creates a new room, **Then** that player is designated as the host
2. **Given** a room with an existing host, **When** a new player joins, **Then** the host designation remains unchanged
3. **Given** a room with multiple players, **When** any participant views the lobby, **Then** the host is clearly identified in the participant list

---

### User Story 2 - Players Join with Validated Names (Priority: P1)

Players can join a room only if they provide a valid player name and a valid room code.

**Why this priority**: Player identity and room access are fundamental to the game experience. Invalid inputs should give clear, helpful feedback rather than failing silently.

**Independent Test**: Can be fully tested by submitting various invalid inputs (empty names, whitespace-only names, invalid room codes) and verifying clear error messages are shown.

**Acceptance Scenarios**:

1. **Given** a player is on the join room form, **When** they submit with an empty or whitespace-only name, **Then** an inline error message is shown and the room is not joined
2. **Given** a player is on the join room form, **When** they submit a valid name with an invalid or non-existent room code, **Then** a clear error message is shown explaining the room was not found
3. **Given** a player is on the join room form, **When** they submit with an empty room code, **Then** an inline error message is shown and the form is not submitted
4. **Given** a player submits a valid name with leading/trailing spaces, **When** the name is processed, **Then** the spaces are trimmed and the trimmed name is used

---

### User Story 3 - Lobby Auto-Refreshes (Priority: P2)

Players in the lobby see new joiners appear automatically without manually clicking a refresh button.

**Why this priority**: A manual refresh button works but creates a poor user experience. Auto-refresh makes the lobby feel live and responsive.

**Independent Test**: Can be tested by opening the lobby in two browser windows, joining from the second window, and verifying the first window automatically shows the new player within a few seconds.

**Acceptance Scenarios**:

1. **Given** a player is on the lobby page, **When** another player joins the room, **Then** the participant list updates automatically within 3 seconds
2. **Given** a player is on the lobby page, **When** the lobby auto-refreshes with no changes, **Then** the player's view remains stable with no visual flicker
3. **Given** a player is on the lobby page, **When** the network is temporarily unavailable during a refresh, **Then** the player sees a subtle loading indicator and the last known state is preserved

---

### User Story 4 - Host Starts the Game (Priority: P1)

Only the host can start the game, and only when at least 2 players are present.

**Why this priority**: Starting the game is the transition point from lobby to gameplay. Host-only control prevents unauthorised starts, and the 2-player minimum ensures the game is playable.

**Independent Test**: Can be tested by verifying the start button is only visible/active for the host, and verifying it requires at least 2 players.

**Acceptance Scenarios**:

1. **Given** the host is viewing the lobby with at least 2 players, **When** the host clicks "Start Game", **Then** the game round begins
2. **Given** a non-host player is viewing the lobby, **When** they look for a start option, **Then** no start button is available to them
3. **Given** the host is viewing the lobby with only 1 player, **When** they look for a start option, **Then** the start button is disabled with a message indicating more players are needed
4. **Given** the host has started the game, **When** they or other players view the lobby, **Then** the lobby transitions to the game view

---

### Edge Cases

- What happens if the host leaves the room? The host role passes to the next player who joined earliest, keeping the game alive
- What happens if all players leave the room? The room should be cleaned up after all participants depart
- What happens when a player submits very long names (e.g., 100+ characters)? Names should be truncated to a reasonable maximum length
- What happens if a player tries to join a room that has already started a game? The join should be rejected with an appropriate message
- What happens if two players join with the same name? Duplicate names are allowed — participants are distinguished by their unique participant ID, not by name

## Requirements

### Functional Requirements

- **FR-001**: System MUST designate the room creator as the host
- **FR-002**: System MUST preserve host designation when new players join
- **FR-003**: System MUST reject player names that are empty or whitespace-only, with an inline error message
- **FR-004**: System MUST trim leading and trailing whitespace from player names before acceptance
- **FR-005**: System MUST reject join attempts for non-existent room codes with a clear error message
- **FR-006**: System MUST reject join attempts for rooms where a game is in progress
- **FR-007**: System MUST auto-refresh lobby state on the frontend at approximately 2-second intervals
- **FR-008**: System MUST show a subtle loading state during lobby refresh without full page flicker
- **FR-009**: System MUST limit the "Start Game" button to the host only — non-host players must not see or have access to this control
- **FR-010**: System MUST require at least 2 participants before the host can start the game
- **FR-011**: System MUST show the start button as disabled with a reason when fewer than 2 players are present
- **FR-012**: System MUST enforce a maximum player name length of 30 characters

### Key Entities

- **Participant**: Represents a player in a room. Has an id, name (trimmed and validated), and an `isHost` flag.
- **Room**: Represents a game room. Has a unique code, status (lobby/playing/finished), participant list, host reference, creation timestamp.
- **LobbySnapshot**: A view of the room presented to players in the lobby. Contains room code, host identity, participant list with names and host indicator, room status.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Players can create a room and see themselves as host within 2 seconds of creation
- **SC-002**: Joiners appear in the host's lobby within 3 seconds of submitting their join request
- **SC-003**: Players who submit invalid names or room codes receive clear error feedback without a page reload
- **SC-004**: The start game flow from host click to lobby transition completes within 2 seconds
- **SC-005**: Non-host players never see or interact with a start game control

## Assumptions

- The room creator is always the host for the lifetime of the room (host transfer is out of scope for v1)
- Lobby polling interval of 2 seconds provides good balance between responsiveness and server load
- Error messages are client-side validated where possible before submitting to server
- The existing "Refresh" button on the lobby page can remain as a fallback for manual refresh
- Players are expected to have stable internet connectivity for the polling to work effectively
