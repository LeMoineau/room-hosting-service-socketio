import RoomNotFoundError from "../../../shared/errors/room/RoomNotFoundError";
import { RestrictedSocket } from "../types/RestrictedSocket";

export namespace SocketUtils {
  //TODO: fill reportError
  export function reportError(socket: RestrictedSocket, error: any) {
    if (error instanceof RoomNotFoundError) {
      socket.emit("room-not-find");
    }
    socket.emit("server-error", {
      type: error.constructor.name,
      message: error.message,
    });
    console.error(error);
  }
}
