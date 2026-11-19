import type { BlackHole } from './blackHole'
import type { IBlackHoleRepository } from './IBlackHoleRepository'

/**
 * 消滅時間に達したブラックホールを削除する
 * @param blackHoles
 * @param onDelete 削除時に実行する関数.引数に削除されるインスタンスとidを取る
 */
export function removeDieBlackHole(
  blackHoles: IBlackHoleRepository,
  onDelete: (blackHoleId: string, blackHole: BlackHole) => void
): void {
  blackHoles.getAllId().forEach((blackHoleId: string) => {
    const blackHole = blackHoles.get(blackHoleId)
    if (blackHole?.isDead ?? false) {
      blackHoles.delete(blackHoleId)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onDelete(blackHoleId, blackHole!) // null合体でundefinedでないことは確定
    }
  })
}

/**
 * BlackHoleRepository内の全ブラックホールを移動
 */
export function moveBlackHoles(dt: number, blackHoles: IBlackHoleRepository): void {
  blackHoles.getAllId().forEach((blackHoleId: string) => {
    const blackHole = blackHoles.get(blackHoleId)
    if (blackHole === undefined) return
    blackHole.move(dt)
    blackHoles.updateActor(blackHoleId, blackHole)
    if (blackHole.position.x < blackHole.startPosition.x || blackHole.position.x > blackHole.reversePosition.x) {
      blackHole.reverseVelocityX()
    }
  })
}
