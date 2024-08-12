import { Socket } from "socket.io";
import Player from "../../../shared/types/Player";
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
