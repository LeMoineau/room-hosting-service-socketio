import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import EventController from "./controllers/EventController";
import { RestrictedSocket } from "./types/RestrictedSocket";
import { RestrictedSocketServer } from "./types/RestrictedSocketServer";
import RoomController from "./controllers/RoomController";

dotenv.config();
const port = process.env.PORT || 3000;

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());

export const httpServer = createServer(app);
export const io = new RestrictedSocketServer(httpServer, {
  cors: { ...cors() },
});

app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/rooms", (req: Request, res: Response) => {
  res.send(RoomController.getAll(req.query));
});

io.on("connection", (socket: RestrictedSocket) => {
  socket.on("create-a-room", EventController.createRoom);
  socket.on("join-a-room", EventController.joinRoom);
  socket.on("player-toggle-ready", EventController.playerToggleReady);
  socket.on("player-start-game", EventController.playerStartGame);
  socket.on("player-leave-room", EventController.playerLeaveRoom);
  socket.on("disconnect", EventController.playerDisconnect);
  socket.on("player-finish-game", EventController.playerFinishGame);
  socket.on("action", EventController.playerAction);
});

export const startServer = (callback?: () => void) => {
  httpServer.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    callback && callback();
  });
};
