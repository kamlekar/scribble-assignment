export type ParticipantRole = "drawer" | "guesser";
export type RoomStatus = "lobby" | "playing" | "finished";

export interface Participant {
  id: string;
  name: string;
  joinedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface RoomSnapshot {
  code: string;
  status: RoomStatus;
  participants: ParticipantSnapshot[];
  hostId: string;
  availableWords: string[];
  roles: ParticipantRole[];
}

export interface RoomSessionResponse {
  participantId: string;
  room: RoomSnapshot;
}
