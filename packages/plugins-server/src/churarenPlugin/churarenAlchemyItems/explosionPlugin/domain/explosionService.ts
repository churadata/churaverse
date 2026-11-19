import type { WorldMap } from '@churaverse/map-plugin-server'
import type { Explosion } from './explosion'
import type { IExplosionRepository } from './IExplosionRepository'

/**
 * 衝突した or 消滅時間に達した爆発を削除
 * @param onDelete 削除時に実行する関数.引数に削除される爆発のインスタンスとidを取る
 */
export function removeDieExplosion(
  explosions: IExplosionRepository,
  onDelete: (explosionId: string, explosion: Explosion) => void
): void {
  explosions.getAllId().forEach((explosionId: string) => {
    const explosion = explosions.get(explosionId)
    if (explosion?.isDead ?? false) {
      explosions.delete(explosionId)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onDelete(explosionId, explosion!) // null合体でundefinedでないことは確定
    }
  })
}

/**
 * ExplosionRepository内の全爆発を微小時間分だけ移動
 * その際にワールド外に出た爆発をdie
 */
export function moveExplosions(dt: number, explosions: IExplosionRepository, worldMap: WorldMap): void {
  explosions.getAllId().forEach((explosionId: string) => {
    const explosion = explosions.get(explosionId)
    if (explosion !== undefined) {
      explosion.move(dt)
      if (
        explosion.position.x < 0 ||
        explosion.position.x > worldMap.width ||
        explosion.position.y < 0 ||
        explosion.position.y > worldMap.height
      ) {
        explosion.die()
      } else {
        explosions.updateActor(explosionId, explosion)
      }
    }
  })
}
