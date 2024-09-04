import { Socket } from "socket.io";
import {
  BasicClientToServerEvents,
  BasicInterServerEvents,
  BasicServerToClientEvents,
  BasicSocketData,
} from "../config/SocketServerConfig";
import { EventsMap } from "socket.io/dist/typed-events";

export type RestrictedSocket<
  ClientToServerEvents extends EventsMap,
  ServerToClientEvents extends EventsMap,
  InterServerEvents extends EventsMap,
  SocketData,
> = Socket<
  BasicClientToServerEvents & ClientToServerEvents,
  BasicServerToClientEvents & ServerToClientEvents,
  BasicInterServerEvents & InterServerEvents,
  BasicSocketData & SocketData
>;
