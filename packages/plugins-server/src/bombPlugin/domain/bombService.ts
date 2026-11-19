import type { IBombRepository } from './IBombRepository'

/**
 * 爆弾が爆破する時間を超えているかチェックする
 */
export function checkExplode(bombs: IBombRepository): void {
  bombs.getAllId().forEach((bombId) => {
    const bomb = bombs.get(bombId)
    if (bomb?.isExplode ?? false) {
      bomb?.explode()
    }
  })
}
