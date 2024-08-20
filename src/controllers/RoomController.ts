import RoomConfig from "../../../shared/types/room/RoomConfig";
import PlayerFactory from "../factories/PlayerFactory";
import SocketRoomFactory from "../factories/SocketRoomFactory";
import { RoomId, SocketId } from "../../../shared/types/Primitives";
import SocketRoom from "../types/SocketRoom";
import RoomNotFoundError from "../../../shared/errors/room/RoomNotFoundError";
import PlayerAlreadyInAnotherRoom from "../../../shared/errors/player/PlayerAlreadyInAnotherRoomError";
import RoomOverviewFactory from "../factories/RoomOverviewFactory";
import RoomOverview from "../../../shared/types/room/RoomOverview";

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

  public getAll(filters?: {
    [config in keyof RoomConfig]?: any;
  }): RoomOverview[] {
    return this._rooms
      .filter((r) => {
        if (r.config.visibility !== "public") return false;
        if (filters) {
          for (let k in filters) {
            if (r.config[k] !== filters[k]) return false;
          }
        }
        return true;
      })
      .map((r) => RoomOverviewFactory.create(r));
  }

  public find(callback: (r: SocketRoom) => boolean): SocketRoom {
    const room = this._rooms.find(callback);
    if (!room) {
      throw new RoomNotFoundError();
    }
    return room;
  }

  public join(socketId: SocketId, roomId: RoomId): SocketRoom {
    const room = this.get(roomId);
    const player = PlayerFactory.create(socketId);
    room.addPlayer(player);
    return room;
  }

  public destroy(roomId: RoomId) {
    const index = this._rooms.findIndex((r) => r.id === roomId);
    if (index === -1) {
      throw new RoomNotFoundError();
    }
    this._rooms.splice(index, 1);
    console.log("room " + roomId + " destroyed", this._rooms);
  }
}

export default new RoomController();
