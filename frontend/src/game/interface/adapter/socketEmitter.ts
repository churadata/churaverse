/* eslint-disable object-shorthand */
import { Scene } from 'phaser'
import { Direction } from '../../domain/model/core/direction'
import { IPlayerRender } from '../../domain/IRender/IPlayerRender'
import { Player } from '../../domain/model/player'
import { PlayerColorName } from '../../domain/model/types'
import { Position } from '../../domain/model/core/position'
import { ISocketEmitter, ProcessedPreloadedData } from '../../interactor/ISocketEmitter'
import { PlayerRender } from '../ui/Render/entity/playerRender'
import {
  BombInfo,
  ChatInfo,
  InvincibleWorldModeInfo,
  MegaphoneInfo,
  ProfileInfo,
  SharkInfo,
  SocketEmitActionType,
  StopInfo,
  TurnInfo,
  WalkInfo,
} from '../socket/actionTypes'
import {
  KickPlayerInfo,
  EmitJoinData,
  PlayerInfo,
  SocketEmitEventType,
  exitOwnPlayerInfo,
  MapInfo,
} from '../socket/eventTypes'
import { Socket } from '../socket/socket'

/**
 * SocketEmitter ISocketEmitterの実装
 */
export class SocketEmitter implements ISocketEmitter {
  public constructor(private readonly socket: Socket, private readonly scene: Scene) {}

  public join(player: Player, id: string): void {
    const playerInfo: PlayerInfo = {
      hp: player.hp,
      x: player.position.x,
      y: player.position.y,
      direction: player.direction,
      playerId: id,
      heroColor: player.color,
      heroName: player.name,
      role: player.role,
    }
    const info: EmitJoinData = { playerInfo }
    this.socket.emitEvent(SocketEmitEventType.EnterPlayer, info)
  }

  public async requestPreloadedData(): Promise<ProcessedPreloadedData> {
    return await new Promise((resolve) => {
      this.socket.emitEvent(SocketEmitEventType.RequestPreloadedData, (data) => {
        resolve(
          Promise.all(
            Object.entries(data.existPlayers).map(async ([id, playerInfo]) => {
              const pos = new Position(playerInfo.x, playerInfo.y)
              const direction = playerInfo.direction
              const hp = playerInfo.hp
              const render: IPlayerRender = await PlayerRender.build(
                this.scene,
                pos,
                direction,
                playerInfo.heroName,
                playerInfo.heroColor,
                hp
              )

              // tupleで返すため,asで強制的に型を決める
              return [
                id,
                new Player(pos, direction, playerInfo.heroName, playerInfo.heroColor, playerInfo.hp, playerInfo.role),
                render,
              ] as [string, Player, IPlayerRender]
            })
          ).then((players) => {
            const processedPreloadedData: ProcessedPreloadedData = {
              existPlayers: players,
              megaphoneUsers: data.megaphoneUsers,
              mapName: data.mapName,
              invincibleWorldModeInfo: data.invincibleWorldModeInfo,
            }
            return processedPreloadedData
          })
        )
      })
    })
  }

  public async checkConnect(): Promise<Array<[string, Player]>> {
    return await new Promise((resolve) => {
      this.socket.emitEvent(SocketEmitEventType.RequestPreloadedData, (data) => {
        resolve(
          Promise.all(
            Object.entries(data.existPlayers).map(([id, playerInfo]) => {
              const pos = new Position(playerInfo.x, playerInfo.y)
              const direction = playerInfo.direction

              // tupleで返すため,asで強制的に型を決める
              return [
                id,
                new Player(pos, direction, playerInfo.heroName, playerInfo.heroColor, playerInfo.hp, playerInfo.role),
              ] as [string, Player]
            })
          )
        )
      })
    })
  }

  public walkPlayer(position: Position, direction: Direction, speed: number): void {
    const info: WalkInfo = {
      startPos: {
        x: position.x,
        y: position.y,
      },
      direction,
      speed,
    }

    this.socket.emitAction(SocketEmitActionType.Walk, info)
  }

  public stopPlayer(position: Position, direction: Direction): void {
    const info: StopInfo = {
      stopPos: {
        x: position.x,
        y: position.y,
      },
      direction,
    }
    this.socket.emitAction(SocketEmitActionType.Stop, info)
  }

  public turnPlayer(direction: Direction): void {
    const info: TurnInfo = { direction }
    this.socket.emitAction(SocketEmitActionType.Turn, info)
  }

  public updatePlayerProfile(playerName: string, color: PlayerColorName): void {
    const info: ProfileInfo = {
      heroColor: color,
      heroName: playerName,
      direction: Direction.down,
    }

    this.socket.emitAction(SocketEmitActionType.Profile, info)
  }

  public spawnShark(sharkId: string, position: Position, direction: Direction): void {
    const info: SharkInfo = {
      sharkId: sharkId,
      startPos: {
        x: position.x,
        y: position.y,
      },
      direction: direction,
    }

    this.socket.emitAction(SocketEmitActionType.Shark, info)
  }

  public spawnBomb(bombId: string, position: Position): void {
    const info: BombInfo = {
      bombId: bombId,
      position: {
        x: position.x,
        y: position.y,
      },
    }

    this.socket.emitAction(SocketEmitActionType.Bomb, info)
  }

  public chat(name: string, message: string): void {
    const info: ChatInfo = {
      name,
      message,
    }

    this.socket.emitAction(SocketEmitActionType.Chat, info)
  }

  public toggleMegaphone(active: boolean): void {
    const info: MegaphoneInfo = {
      active,
    }

    this.socket.emitAction(SocketEmitActionType.Megaphone, info)
  }

  public toggleInvincibleWorldMode(active: boolean): void {
    const info: InvincibleWorldModeInfo = {
      active,
    }

    this.socket.emitAction(SocketEmitActionType.InvincibleWorldMode, info)
  }

  public flushActions(): void {
    this.socket.emitBufferd()
  }

  public requestKickPlayer(kickedId: string, kickerId: string): void {
    const info: KickPlayerInfo = {
      kickedId: kickedId,
      kickerId,
    }
    this.socket.emitEvent(SocketEmitEventType.RequestKickPlayer, info)
  }

  public exitOwnPlayer(playerId: string): void {
    const info: exitOwnPlayerInfo = {
      playerId,
    }
    this.socket.emitEvent(SocketEmitEventType.ExitOwnPlayer, info)
  }

  public requestNewMap(mapName: string): void {
    const info: MapInfo = {
      mapName,
    }
    this.socket.emitEvent(SocketEmitEventType.RequestNewMap, info)
  }
}
