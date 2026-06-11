import type { CanvasState } from "./canvas.js";

export type ParticipantRole = "drawer" | "guesser";
export type RoomStatus = "lobby" | "playing" | "finished";

export interface Participant {
  id: string;
  name: string;
  joinedAt: string;
  role?: ParticipantRole;
}

export interface ParticipantSnapshot {
  id: string;
  name: string;
  joinedAt: string;
  isHost: boolean;
  role: ParticipantRole | null;
}

export interface Room {
  code: string;
  hostId: string;
  status: RoomStatus;
  participants: Participant[];
  word?: string;
  canvasState?: CanvasState | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoomSnapshot {
  code: string;
  status: RoomStatus;
  participants: ParticipantSnapshot[];
  hostId: string;
  word?: string;
  availableWords: string[];
  roles: ParticipantRole[];
}

export interface RoomSessionResponse {
  participantId: string;
  room: RoomSnapshot;
}
