import { Scene } from 'phaser'
import MainScene from '../scene/main'
import {
  Player,
  WalkAnimState,
  Direction,
  ReceivedDieInfo,
  ReceivedRespawnInfo,
} from './player'
import { Socket } from '../socket'

export interface EmitWalkInfo {
  animState: WalkAnimState
  startPos: { x: number; y: number; direction: Direction }
  walkSpeed: number
}

export interface EmitTurnInfo {
  direction: Direction
}

export class OwnPlayer extends Player {
  /**
   * プレイヤーのマップ上のタイル座標
   */
  public tilePos?: { tx: number; ty: number }

  public returnDirFlag(direction: string): number[] {
    let x: number = 0
    let y: number = 0

    if (direction === 'up') {
      y = -1
    } else if (direction === 'down') {
      y = 1
    } else if (direction === 'left') {
      x = -1
    } else if (direction === 'right') {
      x = 1
    }
    return [x, y]
  }

  public walkInfo(heroAnimState: WalkAnimState): EmitWalkInfo {
    const walkInfo: EmitWalkInfo = {
      animState: heroAnimState,
      startPos: { x: this.hero!.x, y: this.hero!.y, direction: this.direction },
      walkSpeed: this.getWalkSpeed,
    }
    return walkInfo
  }

  public get turnInfo(): EmitTurnInfo {
    return { direction: this.direction }
  }

  public static die(mainScene: MainScene, dieInfo: ReceivedDieInfo): void {
    mainScene.ownPlayer.die()
  }

  public static respawn(
    mainScene: MainScene,
    respawnInfo: ReceivedRespawnInfo
  ): void {
    mainScene.ownPlayer.revive()
    mainScene.ownPlayer.warp(
      respawnInfo.respawnPos.x,
      respawnInfo.respawnPos.y,
      respawnInfo.respawnPos.direction
    )
  }

  public static socketOn(scene: Scene, socket: Socket): void {
    socket.on('ownPlayerDie', OwnPlayer.die)
    socket.on('ownPlayerRespawn', OwnPlayer.respawn)
  }
}
