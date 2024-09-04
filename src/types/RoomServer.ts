import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer, Server } from "http";
import { EventsMap } from "socket.io/dist/typed-events";
import RoomController from "../controllers/RoomController";
import { RestrictedSocket } from "./RestrictedSocket";
import EventController from "../controllers/EventController";
import { RestrictedSocketServer } from "./RestrictedSocketServer";

class RoomServer<
  ClientToServerEvents extends EventsMap,
  ServerToClientEvents extends EventsMap,
  InterServerEvents extends EventsMap,
  SocketData,
> {
  _port: number;
  _app: Express;
  _httpServer: Server;
  _io: RestrictedSocketServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  _hasInitEventListeners: boolean = false;

  constructor(port?: number) {
    this._port = port ?? 3000;
    this._app = express();
    this._httpServer = createServer(this._app);
    this._io = new RestrictedSocketServer<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(this._httpServer, {
      cors: { ...cors() },
    });
  }

  _init() {
    this._app.use(bodyParser.json());
    this._app.use(cors());

    this._app.get("/", (_: Request, res: Response) => {
      res.send("Express + TypeScript Server");
    });

    this._app.get("/rooms", (req: Request, res: Response) => {
      res.send(RoomController.getAll(req.query));
    });
  }

  onConnection(
    callback?: (
      socket: RestrictedSocket<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >
    ) => void
  ) {
    this._hasInitEventListeners = true;
    this._io.on(
      "connection",
      (
        socket: RestrictedSocket<
          ClientToServerEvents,
          ServerToClientEvents,
          InterServerEvents,
          SocketData
        >
      ) => {
        const bSocket = socket as RestrictedSocket<{}, {}, {}, {}>;
        bSocket.on("create-a-room", EventController.createRoom);
        bSocket.on("join-a-room", EventController.joinRoom);
        bSocket.on("player-toggle-ready", EventController.playerToggleReady);
        bSocket.on("player-start-game", EventController.playerStartGame);
        bSocket.on("player-leave-room", EventController.playerLeaveRoom);
        bSocket.on("disconnect", EventController.playerDisconnect);
        bSocket.on("player-finish-game", EventController.playerFinishGame);
        bSocket.on("action", EventController.playerAction);
        callback && callback(socket);
      }
    );
  }

  startServer(callback?: () => void) {
    if (!this._hasInitEventListeners) {
      this.onConnection();
    }
    this._httpServer.listen(this._port, () => {
      console.log(
        `⚡️[server]: Server is running at http://localhost:${this._port}`
      );
      callback && callback();
    });
  }
}

export default RoomServer;
