import Room from "../../../shared/types/room/Room";
import RoomOverview from "../../../shared/types/room/RoomOverview";

class RoomOverviewFactory {
  public create(room: Room): RoomOverview {
    return {
      id: room.id,
      config: room.config,
      nbPlayers: room.players.length,
    };
  }
}

export default new RoomOverviewFactory();
