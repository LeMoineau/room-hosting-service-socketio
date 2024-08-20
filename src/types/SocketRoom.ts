import Player from "../../../shared/types/player/Player";
import { PlayerId, RoomId } from "../../../shared/types/Primitives";
import Room from "../../../shared/types/room/Room";
import RoomConfig from "../../../shared/types/room/RoomConfig";
import PlayerNotFoundError from "../../../shared/errors/player/PlayerNotFoundError";
import PlayerAlreadyInRoomError from "../../../shared/errors/player/PlayerAlreadyInRoomError";
import PlayerCantStartGameError from "../../../shared/errors/player/PlayerCantStartGameError";
import SomePlayersAreNotReadyError from "../../../shared/errors/room/SomePlayersAreNotReadyError";
import GameAlreadyStartedError from "./../../../shared/errors/game/GameAlreadyStartedError";
import PlayerCantFinishGameError from "./../../../shared/errors/player/PlayerCantFinishGameError";
import GameNotStartedError from "./../../../shared/errors/game/GameNotStartedError";
import { RoomActions } from "../../../shared/types/room/RoomActions";

class SocketRoom implements Room {
  id: string;
  ownerId: PlayerId;
  players: Player[];
  actions: RoomActions;
  config: RoomConfig;

  constructor(id: RoomId, owner: Player, config: RoomConfig) {
    this.id = id;
    this.ownerId = owner.id;
    this.players = [owner];
    this.config = config;
    this.actions = {
      started: false,
    };
  }

  public get gameStarted(): boolean {
    return this.actions.started;
  }

  public get isEmpty(): boolean {
    return this.players.length === 0;
  }

  public isOwner(playerId: PlayerId): boolean {
    return this.ownerId === playerId;
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
    if (!this.config.newPlayersCanJoinWhenGameStarted && this.gameStarted) {
      throw new GameAlreadyStartedError();
    }
    this.players.push(player);
  }

  public removePlayer(playerId: PlayerId) {
    const index = this.players.findIndex((p) => p.id === playerId);
    if (index === -1) {
      throw new PlayerNotFoundError();
    }
    this.players.splice(index, 1);
    if (this.ownerId === playerId && !this.isEmpty) {
      this.ownerId = this.players[0].id;
    }
  }

  public updatePlayerState(playerId: PlayerId, key: string, value: any) {
    if (!this.hasPlayer(playerId)) {
      throw new PlayerNotFoundError();
    }
    const playerIndex = this.players.findIndex((p) => p.id === playerId);
    this.players[playerIndex].state[key] = value;
  }

  public togglePlayerReadyState(playerId: PlayerId, ready: boolean) {
    if (this.actions.started) {
      throw new GameAlreadyStartedError();
    }
    this.updatePlayerState(playerId, "ready", ready);
  }

  public startGame(senderId: PlayerId) {
    if (this.ownerId !== senderId) {
      throw new PlayerCantStartGameError();
    }
    if (
      !this.config.ownerCanForceGameStarting &&
      this.players.some((p) => !p.state.ready)
    ) {
      throw new SomePlayersAreNotReadyError();
    }
    if (this.actions.started) {
      throw new GameAlreadyStartedError();
    }
    this.actions.started = true;
  }

  public finishGame(senderId: PlayerId) {
    if (!this.gameStarted) {
      throw new GameNotStartedError();
    }
    if (this.ownerId !== senderId) {
      throw new PlayerCantFinishGameError();
    }
    this.players.forEach((p) => (p.state.ready = false));
    this.actions.started = false;
  }
}

export default SocketRoom;
