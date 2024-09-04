import { RoomId } from "../../../shared/types/Primitives";
import Room from "../../../shared/types/room/Room";
import RoomConfig from "../../../shared/types/room/RoomConfig";

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

export interface BasicServerToClientEvents {
  "room-created": (r: Room) => void;
  "room-find": (r: Room) => void;
  "player-join-your-room": (r: Room) => void;
  "player-ready-change": (r: Room) => void;
  "game-started": (r: Room) => void;
  "player-leave-room": (r: Room) => void;
  "room-left": () => void;
  "player-become-room-owner": (r: Room) => void;
  "game-finish": (r: Room) => void;

  // errors
  "server-error": (err: { type: string; message: string }) => void;
  "room-not-find": () => void;

  // custom actions
  [action: `action:${string}`]: (r: Room) => void;
  action: (actionName: string, r: Room) => void;
}

export interface BasicClientToServerEvents {
  "create-a-room": (rc: RoomConfig) => void;
  "join-a-room": (ri: RoomId) => void;
  "player-toggle-ready": (ri: RoomId, ready: boolean) => void;
  "player-start-game": (ri: RoomId) => void;
  "player-leave-room": (ri: RoomId) => void;
  "player-finish-game": (ri: RoomId) => void;

  // custom actions
  action: (actionName: string, ...args: any[]) => void;
}

export interface BasicInterServerEvents {
  ping: () => void;
}

export interface BasicSocketData {
  inRoom?: boolean;
}
