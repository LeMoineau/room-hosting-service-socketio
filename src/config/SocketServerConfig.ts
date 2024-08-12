import { RoomId } from "../../../shared/types/Primitives";
import Room from "../../../shared/types/Room";
import RoomConfig from "../../../shared/types/RoomConfig";

export const SocketEvent = {
  CONNECTION: "connection",
  CREATE_A_ROOM: "create-a-room",
  ROOM_CREATED: "room-created",
  JOIN_A_ROOM: "join-a-room",
  FIND_THE_ROOM: "find-the-room",
  NOT_FIND_THE_ROOM: "not-find-the-room",
  PLAYER_JOIN_YOUR_ROOM: "player-join-your-room",
  DISCONNECT: "disconnect",
  SEND_PLAYER_INFOS: "send-player-infos",
  ROOM_READY: "room-ready",
  BATTLE_BEGIN: "battle-begin",
  HIT: "hit",
  SPELL: "spell",
  UPDATE_BATTLE_STATE: "update-battle-state",
  BATTLE_FINISH: "battle-finish",
  JOIN_THE_QUEUE: "join-the-queue",
  PLAYER_TOGGLE_READY: "player-toggle-ready",
};

export interface ServerToClientEvents {
  "room-created": (r: Room) => void;
  "room-find": (r: Room) => void;
  "room-not-find": () => void;
  "player-join-your-room": (r: Room) => void;
  "player-ready-change": (r: Room) => void;
}

export interface ClientToServerEvents {
  "create-a-room": (rc: RoomConfig) => void;
  "join-a-room": (ri: RoomId) => void;
  "player-toggle-ready": (ri: RoomId, ready: boolean) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
