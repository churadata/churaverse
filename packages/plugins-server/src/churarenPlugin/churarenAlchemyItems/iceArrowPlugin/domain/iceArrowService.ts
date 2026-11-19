import type { WorldMap } from '@churaverse/map-plugin-server'
import type { IIceArrowRepository } from './IIceArrowRepository'
import type { IceArrow } from './iceArrow'

/**
 * 衝突した or 消滅時間に達した氷の矢を削除
 * @param onDelete 削除時に実行する関数.引数に削除される氷の矢のインスタンスとidを取る
 */
export function removeDieIceArrow(
  iceArrows: IIceArrowRepository,
  onDelete: (iceArrowId: string, iceArrow: IceArrow) => void
): void {
  iceArrows.getAllId().forEach((iceArrowId: string) => {
    const iceArrow = iceArrows.get(iceArrowId)
    if (iceArrow?.isDead ?? false) {
      iceArrows.delete(iceArrowId)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onDelete(iceArrowId, iceArrow!) // null合体でundefinedでないことは確定
    }
  })
}

/**
 * IceArrowRepository内の全氷の矢を微小時間分だけ移動
 * その際にワールド外に出た氷の矢をdie
 */
export function moveIceArrows(dt: number, iceArrows: IIceArrowRepository, worldMap: WorldMap): void {
  iceArrows.getAllId().forEach((iceArrowId: string) => {
    const iceArrow = iceArrows.get(iceArrowId)
    if (iceArrow !== undefined) {
      iceArrow.move(dt)
      if (
        iceArrow.position.x < 0 ||
        iceArrow.position.x > worldMap.width ||
        iceArrow.position.y < 0 ||
        iceArrow.position.y > worldMap.height
      ) {
        iceArrow.isDead = true
      } else {
        iceArrows.updateActor(iceArrowId, iceArrow)
      }
    }
  })
}
