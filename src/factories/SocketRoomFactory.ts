import RoomConfig from "../../../shared/types/RoomConfig";
import Player from "../../../shared/types/Player";
import { RoomUtils } from "../../../shared/utils/room-utils";
import SocketRoom from "../types/SocketRoom";
import { RoomId } from "../../../shared/types/Primitives";

class SocketRoomFactory {
  private _alreadyUseId: RoomId[] = [];

  public create(owner: Player, config: RoomConfig): SocketRoom {
    let roomId = RoomUtils.generateId();
    while (this._alreadyUseId.includes(roomId)) {
      roomId = RoomUtils.generateId();
    }
    this._alreadyUseId.push(roomId);
    return new SocketRoom(roomId, owner, config);
  }
}

export default new SocketRoomFactory();
