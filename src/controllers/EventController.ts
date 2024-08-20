import RoomConfig from "../../../shared/types/room/RoomConfig";
import RoomController from "./RoomController";
import { RoomId } from "../../../shared/types/Primitives";
import { RestrictedSocket } from "../types/RestrictedSocket";
import { SocketUtils } from "../utils/socket-utils";
import SocketRoom from "../types/SocketRoom";

class EventController {
  public createRoom(this: RestrictedSocket, roomConfig: RoomConfig) {
    try {
      const room = RoomController.create(this.id, roomConfig);
      this.data.inRoom = true;
      this.join(room.id);
      this.emit("room-created", room);
    } catch (err) {
      SocketUtils.reportError(this, err);
    }
  }

  public joinRoom(this: RestrictedSocket, roomId: RoomId) {
    try {
      const room = RoomController.join(this.id, roomId);
      this.data.inRoom = true;
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

  public playerStartGame(this: RestrictedSocket, roomId: RoomId) {
    try {
      const room = RoomController.get(roomId);
      room.startGame(this.id);
      this.emit("game-started", room);
      this.to(room.id).emit("game-started", room);
    } catch (err) {
      SocketUtils.reportError(this, err);
    }
  }

  private static _leaveRoom(socket: RestrictedSocket, room: SocketRoom) {
    const wasOwner = room.isOwner(socket.id);
    room.removePlayer(socket.id);
    socket.data.inRoom = false;
    socket.leave(room.id);
    socket.to(room.id).emit("player-leave-room", room);
    if (room.isEmpty) {
      RoomController.destroy(room.id);
    } else if (wasOwner) {
      socket.to(room.ownerId).emit("player-become-room-owner", room);
    }
  }

  public playerLeaveRoom(this: RestrictedSocket, roomId: RoomId) {
    try {
      const room = RoomController.get(roomId);
      EventController._leaveRoom(this, room);
      this.emit("room-left");
    } catch (err) {
      SocketUtils.reportError(this, err);
    }
  }

  public playerDisconnect(this: RestrictedSocket) {
    try {
      if (!this.data.inRoom) return;
      const room = RoomController.find((r) => r.hasPlayer(this.id));
      EventController._leaveRoom(this, room);
    } catch (err) {
      SocketUtils.reportError(this, err);
    }
  }

  public playerFinishGame(this: RestrictedSocket, roomId: RoomId) {
    try {
      const room = RoomController.get(roomId);
      room.finishGame(this.id);
      this.emit("game-finish", room);
      this.to(room.id).emit("game-finish", room);
    } catch (err) {
      SocketUtils.reportError(this, err);
    }
  }

  public playerAction(
    this: RestrictedSocket,
    actionName: string,
    roomId: RoomId
  ) {
    try {
      const room = RoomController.get(roomId);
      this.emit(`action:${actionName}`, room);
      this.emit("action", actionName, room);
      this.to(roomId).emit(`action:${actionName}`, room);
      this.to(roomId).emit("action", actionName, room);
    } catch (err) {
      SocketUtils.reportError(this, err);
    }
  }
}
export default new EventController();
