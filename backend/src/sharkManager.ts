import {
  getCollidedDict,
  LinearQuadTreeSpace,
  Rectangle,
} from './collisionDetection'
import { PlayerManager } from './playerManager'
import OutputDataQueue from './queueData'

export interface SharkInfo extends Rectangle {
  playerId: string
  startTime: number
  x: number
  y: number
  xSpeed: number
  ySpeed: number
  readonly width: 90 | 30
  readonly height: 30 | 90
}

export type Sharks = Map<string, SharkInfo>

export class SharkManager {
  static readonly ANIM_DURATION = 1600
  static readonly DISTANCE = 1000
  static readonly SPEED = this.DISTANCE / this.ANIM_DURATION

  static readonly LONG_SIDE = 90
  static readonly SHORT_SIDE = 30

  static readonly DAMAGE = 20

  public allSharkInfos: Sharks = new Map< string, SharkInfo >
  public qtree = new LinearQuadTreeSpace()

  private beforeUpdateTime: number = Date.now()

  // 全てのサメと全プレイヤーの当たり判定
  // 衝突していた場合はプレイヤーにダメージ、サメを削除
  public checkCollision(playerManager: PlayerManager): void {
    const collidedDict = getCollidedDict(
      this.qtree,
      playerManager.qtree,
      this.allSharkInfos,
      playerManager.allPlayerInfos
    )

    if (Object.keys(collidedDict).length > 0)
      for (const sharkId of Object.keys(collidedDict)) {
        const shark = this.allSharkInfos.get(sharkId)
        let isHit = false
        for (const playerId of collidedDict[sharkId]) {
          const player = playerManager.allPlayerInfos.get(playerId)

          if (shark !== undefined && player !== undefined) {
            if (player.isDead) continue

            if (shark.playerId === playerId) continue

            isHit = true
            playerManager.decreaseHp(playerId, SharkManager.DAMAGE)
            const damageInfo = {
              attacker: shark.playerId,
              target: playerId,
              cause: 'shark',
              damage: SharkManager.DAMAGE,
            }
            OutputDataQueue.insertAllTransmitQueue([
              { type: 'damage', info: damageInfo },
            ])
          }
        }
        if (isHit) {
          const hitInfo = {
            sharkId,
          }
          OutputDataQueue.insertAllTransmitQueue([
            { type: 'hitShark', info: hitInfo },
          ])
          this.allSharkInfos.delete(sharkId)
          this.qtree.removeActor(sharkId)
        }
      }
  }

  public update(now: number, playerManager: PlayerManager): void {
    const dt = now - this.beforeUpdateTime
    this.beforeUpdateTime = now

    const sharkIds = this.allSharkInfos.keys()
    for (const sharkId of sharkIds) {
      const shark = this.allSharkInfos.get(sharkId)
      if (shark !== undefined) {
        if (now - shark.startTime >= SharkManager.ANIM_DURATION) {
          this.allSharkInfos.delete(sharkId)
          this.qtree.removeActor(sharkId)
        } else {
          shark.x += shark.xSpeed * dt
          shark.y += shark.ySpeed * dt

          const existInWorld = this.qtree.updateActor(shark, sharkId)

          // サメがワールド外に出ていた場合は削除
          if (!existInWorld) {
            this.allSharkInfos.delete(sharkId)
          }
        }
      }
    }

    this.checkCollision(playerManager)
  }
}
