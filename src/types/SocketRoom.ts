import Player from "../../../shared/types/Player";
import { PlayerId, RoomId } from "../../../shared/types/Primitives";
import Room from "../../../shared/types/Room";
import RoomConfig from "../../../shared/types/RoomConfig";
import PlayerNotFoundError from "../../../shared/errors/PlayerNotFoundError";
import PlayerAlreadyInRoomError from "../../../shared/errors/PlayerAlreadyInRoomError";

class SocketRoom implements Room {
  id: string;
  ownerId: PlayerId;
  players: Player[];
  actions: { [key: string]: any };
  config: RoomConfig;

  constructor(id: RoomId, owner: Player, config: RoomConfig) {
    this.id = id;
    this.ownerId = owner.id;
    this.players = [owner];
    this.config = config;
    this.actions = {};
  }

  public getPlayer(playerId: PlayerId): Player | undefined {
    return this.players.find((p) => p.id === playerId);
  }

  public hasPlayer(playerId: PlayerId): boolean {
    return this.getPlayer(playerId) !== undefined;
  }

  public addPlayer(player: Player) {
    if (this.hasPlayer(player.id)) {
      throw new PlayerAlreadyInRoomError();
    }
    this.players.push(player);
  }

  public updatePlayerState(playerId: PlayerId, key: string, value: any) {
    if (!this.hasPlayer(playerId)) {
      throw new PlayerNotFoundError();
    }
    const playerIndex = this.players.findIndex((p) => p.id === playerId);
    this.players[playerIndex].state[key] = value;
  }

  public togglePlayerReadyState(playerId: PlayerId, ready: boolean) {
    this.updatePlayerState(playerId, "ready", ready);
  }
}

export default SocketRoom;
