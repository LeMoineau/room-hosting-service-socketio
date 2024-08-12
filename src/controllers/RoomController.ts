import RoomConfig from "./../../../shared/types/RoomConfig";
import { Socket } from "socket.io";
import PlayerFactory from "../factories/PlayerFactory";
import SocketRoomFactory from "../factories/SocketRoomFactory";
import { RoomId, SocketId } from "../../../shared/types/Primitives";
import SocketRoom from "../types/SocketRoom";
import RoomNotFoundError from "./../../../shared/errors/RoomNotFoundError";
import PlayerAlreadyInAnotherRoom from "../../../shared/errors/PlayerAlreadyInAnotherRoomError";

class RoomController {
  private _rooms: SocketRoom[];

  constructor() {
    this._rooms = [];
  }

  public create(socketId: SocketId, config: RoomConfig): SocketRoom {
    if (this._rooms.find((r) => r.players.some((p) => p.id === socketId))) {
      throw new PlayerAlreadyInAnotherRoom();
    }
    const owner = PlayerFactory.create(socketId);
    const room = SocketRoomFactory.create(owner, config);
    this._rooms.push(room);
    return room;
  }

  public get(roomId: RoomId): SocketRoom {
    const room = this._rooms.find((r) => r.id === roomId);
    if (!room) {
      throw new RoomNotFoundError();
    }
    return room;
  }

  public join(socketId: SocketId, roomId: RoomId): SocketRoom {
    const room = this.get(roomId);
    if (!room) {
      throw new RoomNotFoundError();
    }
    const player = PlayerFactory.create(socketId);
    room.addPlayer(player);
    return room;
  }

  public destroy(socket: Socket, roomId: RoomId) {}
}

export default new RoomController();
