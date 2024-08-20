import RoomConfig from "../../../shared/types/room/RoomConfig";
import Player from "../../../shared/types/player/Player";
import { RoomUtils } from "../../../shared/utils/room-utils";
import SocketRoom from "../types/SocketRoom";
import { RoomId } from "../../../shared/types/Primitives";
import { DefaultValues } from "../config/DefaultValues";

class SocketRoomFactory {
  private _alreadyUseId: RoomId[] = [];

  private _assignId(): string {
    let roomId = RoomUtils.generateId();
    while (this._alreadyUseId.includes(roomId)) {
      roomId = RoomUtils.generateId();
    }
    return roomId;
  }

  private _assignDefaultConfig(config: RoomConfig): RoomConfig {
    if (!config.visibility) {
      config.visibility = DefaultValues.RoomVisibility;
    }
    return config;
  }

  public create(owner: Player, config: RoomConfig): SocketRoom {
    const roomId = this._assignId();
    this._alreadyUseId.push(roomId);
    return new SocketRoom(roomId, owner, this._assignDefaultConfig(config));
  }
}

export default new SocketRoomFactory();
