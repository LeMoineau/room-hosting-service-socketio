import EventController from "./controllers/EventController";
import RoomController from "./controllers/RoomController";
import RoomServer from "./types/RoomServer";
import SocketRoom from "./types/SocketRoom";

/**
 * Example Room Server
 *
 * How to use:
 *
 * roomServer.onConnection((socket) => {
 *  socket.on("test", (id) => {
 *    console.log("test: ", id);
 *  });
 * });
 * roomServer.startServer();
 */
export const exampleRoomServer = new RoomServer();

export { RoomServer, RoomController, EventController, SocketRoom };
