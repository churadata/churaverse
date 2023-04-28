import { IBombRepository } from '../IRepository/IBombRepository'

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

/**
 * 爆発済みの爆弾を削除する
 */
export function removeExplodedBomb(bombs: IBombRepository): void {
  bombs.getAllId().forEach((bombId) => {
    if (bombs.get(bombId)?.isExplode ?? false) {
      bombs.delete(bombId)
    }
  })
}
