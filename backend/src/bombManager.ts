import {
  getCollidedDict,
  LinearQuadTreeSpace,
  Rectangle,
} from './collisionDetection'
import { PlayerManager } from './playerManager'
import OutputDataQueue from './queueData'

export interface BombInfo extends Rectangle {
  playerId: string
  startTime: number
  x: number
  y: number
  width: 80
  height: 80
}

export type Bombs = Map<string, BombInfo>

export class BombManager {
  static readonly ANIM_DURATION = 875
  static readonly DAMAGE = 50
  public allBombInfos: Bombs = new Map<string, BombInfo>()
  public qtree = new LinearQuadTreeSpace()

  // idで指定した爆弾と全プレイヤーの当たり判定
  // 衝突しているプレイヤーにダメージを与える
  // 衝突の有無に関わらずidで指定した爆弾を削除する
  private explosion(bombId: string, playerManager: PlayerManager): void {
    const bomb = this.allBombInfos.get(bombId)
    const collidedDict = getCollidedDict(
      this.qtree,
      playerManager.qtree,
      this.allBombInfos,
      playerManager.allPlayerInfos
    )
    if (collidedDict[bombId] === undefined) {
      this.removeBomb(bombId)
      return
    }
    for (const playerId of collidedDict[bombId]) {
      if (bomb === undefined) {
        return
      }
      const player = playerManager.allPlayerInfos.get(playerId)
      if (player === undefined) {
        return
      }
      if (bomb.playerId === playerId) continue // 自分の爆弾に当たるようにする場合はコメントアウト
      if (player.isDead) continue
      playerManager.decreaseHp(playerId, BombManager.DAMAGE)
      const damageInfo = {
        attacker: bomb.playerId,
        target: playerId,
        cause: 'bomb',
        damage: BombManager.DAMAGE,
      }
      OutputDataQueue.insertAllTransmitQueue([
        { type: 'damage', info: damageInfo },
      ])
    }

    this.removeBomb(bombId)
  }

  public update(now: number, playerManager: PlayerManager): void {
    const bombIds = this.allBombInfos.keys()
    for (const bombId of bombIds) {
      const bomb = this.allBombInfos.get(bombId)
      if (bomb === undefined) {
        return
      }
      if (
        now - bomb.startTime >=
        BombManager.ANIM_DURATION
      ) {
        this.explosion(bombId, playerManager)
      }
    }
  }

  private removeBomb(bombId: string): void {
    this.allBombInfos.delete(bombId)
    this.qtree.removeActor(bombId)
  }
}
