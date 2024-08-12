import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import EventController from "./controllers/EventController";
import { RestrictedSocket } from "./types/RestrictedSocket";
import { RestrictedSocketServer } from "./types/RestrictedSocketServer";

dotenv.config();
const port = process.env.PORT || 3000;

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());

export const httpServer = createServer(app);
const io = new RestrictedSocketServer(httpServer, { cors: { ...cors() } });

app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

io.on("connection", (socket: RestrictedSocket) => {
  socket.on("create-a-room", EventController.createRoom);
  socket.on("join-a-room", EventController.joinRoom);
  socket.on("player-toggle-ready", EventController.playerToggleReady);
});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
