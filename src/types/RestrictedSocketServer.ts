import { Server } from "socket.io";
import {
  BasicClientToServerEvents,
  BasicInterServerEvents,
  BasicServerToClientEvents,
  BasicSocketData,
} from "../config/SocketServerConfig";
import { EventsMap } from "socket.io/dist/typed-events";

export class RestrictedSocketServer<
  ClientToServerEvents extends EventsMap,
  ServerToClientEvents extends EventsMap,
  InterServerEvents extends EventsMap,
  SocketData,
> extends Server<
  BasicClientToServerEvents & ClientToServerEvents,
  BasicServerToClientEvents & ServerToClientEvents,
  BasicInterServerEvents & InterServerEvents,
  BasicSocketData & SocketData
> {}
