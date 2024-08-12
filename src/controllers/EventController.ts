import RoomConfig from "../../../shared/types/RoomConfig";
import RoomController from "./RoomController";
import { RoomId } from "../../../shared/types/Primitives";
import { RestrictedSocket } from "../types/RestrictedSocket";
import { SocketUtils } from "../utils/socket-utils";

class EventController {
  public createRoom(this: RestrictedSocket, roomConfig: RoomConfig) {
    try {
      const room = RoomController.create(this.id, roomConfig);
      this.join(room.id);
      this.emit("room-created", room);
    } catch (err) {
      SocketUtils.reportError(this, err);
    }
  }

  public joinRoom(this: RestrictedSocket, roomId: RoomId) {
    try {
      const room = RoomController.join(this.id, roomId);
      this.emit("room-find", room);
      this.to(room.id).emit("player-join-your-room", room);
      this.join(room.id);
    } catch (err) {
      SocketUtils.reportError(this, err);
    }
  }

  public playerToggleReady(
    this: RestrictedSocket,
    roomId: RoomId,
    ready: boolean
  ) {
    try {
      const room = RoomController.get(roomId);
      room.togglePlayerReadyState(this.id, ready);
      this.emit("player-ready-change", room);
      this.to(room.id).emit("player-ready-change", room);
    } catch (err) {
      SocketUtils.reportError(this, err);
    }
  }
}

export default new EventController();
