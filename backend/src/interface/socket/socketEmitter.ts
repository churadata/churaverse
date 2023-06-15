import { Direction } from '../../domain/core/direction'
import { Player } from '../../domain/model/player'
import { Position } from '../../domain/core/position'
import { ISocketEmitter } from '../../interactor/IEmitter/ISocketEmitter'
import {
  SocketEmitOnlyActionType,
  PlayerDamageInfo,
  PlayerDieInfo,
  PlayerRespawnInfo,
  SharkDestroyInfo,
} from './action/actionTypes'
import { SocketEmitEventType, PlayerInfo } from './eventTypes'
import { Socket } from './socket'
import { DamageCause } from '../../domain/model/deathLog'

export class SocketEmitter implements ISocketEmitter {
  public constructor(private readonly socket: Socket) {}

  /**
   * 新たなプレイヤーが入室したことを他プレイヤーにemit
   */
  public emitNewPlayer(socketId: string, player: Player): void {
    const emitPlayerInfo: PlayerInfo = {
      x: player.position.x,
      y: player.position.y,
      direction: player.direction,
      playerId: socketId,
      heroColor: player.color,
      heroName: player.name,
    }

    this.socket.emitEventBroadCastFrom(
      SocketEmitEventType.NewPlayer,
      socketId,
      emitPlayerInfo
    )
  }

  /**
   * プレイヤーが退室したことを他プレイヤーにemit
   */
  public emitLeavePlayer(socketId: string): void {
    this.socket.removeTransmitQueue(socketId)
    this.socket.emitEventBroadCastFrom(
      SocketEmitEventType.Disconnected,
      socketId,
      socketId
    )
  }

  /**
   * プレイヤーがダメージを受けたことを全プレイヤーにemit
   */
  public emitDamage(
    attacker: string,
    target: string,
    cause: DamageCause,
    damage: number
  ): void {
    const info: PlayerDamageInfo = {
      attacker,
      target,
      cause,
      damage,
    }
    this.socket.emitActionBroadCast(SocketEmitOnlyActionType.Damage, info)
  }

  /**
   * プレイヤーが死亡したことを全プレイヤーにemit
   */
  public emitPlayerDie(playerId: string): void {
    const info: PlayerDieInfo = {
      id: playerId,
    }
    this.socket.emitActionTo(playerId, 'ownPlayerDie', info)
    this.socket.emitActionBroadCastFrom(playerId, 'otherPlayerDie', info)
  }

  /**
   * プレイヤーが復活したことを全プレイヤーにemit
   */
  public emitPlayerRespawn(
    playerId: string,
    position: Position,
    direction: Direction
  ): void {
    const info: PlayerRespawnInfo = {
      id: playerId,
      respawnPos: {
        x: position.x,
        y: position.y,
        direction,
      },
    }

    this.socket.emitActionTo(playerId, 'ownPlayerRespawn', info)
    this.socket.emitActionBroadCastFrom(playerId, 'otherPlayerRespawn', info)
  }

  /**
   * プレイヤーと衝突したサメが削除されることを全プレイヤーにemit
   */
  public emitHitShark(sharkId: string): void {
    const emitInfo: SharkDestroyInfo = {
      sharkId,
    }
    this.socket.emitActionBroadCast(SocketEmitOnlyActionType.HitShark, emitInfo)
  }
}
