import { Socket } from "socket.io";
import PlayerNotFoundError from "../../../shared/errors/PlayerNotFoundError";
import PlayerAlreadyInRoom from "../../../shared/errors/PlayerAlreadyInRoomError";
import RoomNotFoundError from "../../../shared/errors/RoomNotFoundError";

export namespace SocketUtils {
  //TODO: fill reportError
  export function reportError(socket: Socket, error: any) {
    if (error instanceof PlayerNotFoundError) {
      socket.emit("");
    } else if (error instanceof PlayerAlreadyInRoom) {
    } else if (error instanceof RoomNotFoundError) {
    } else {
    }
  }
}
