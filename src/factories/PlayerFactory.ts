import Player from "../../../shared/types/player/Player";
import { SocketId } from "../../../shared/types/Primitives";

class PlayerFactory {
  public create(socketId: SocketId): Player {
    const player: Player = {
      id: socketId,
      state: {
        ready: false,
      },
    };
    return player;
  }
}

export default new PlayerFactory();
