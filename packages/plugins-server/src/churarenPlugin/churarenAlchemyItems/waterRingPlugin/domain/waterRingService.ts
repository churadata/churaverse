import type { IWaterRingRepository } from './IWaterRingRepository'
import type { WaterRing } from './waterRing'

/**
 * 消滅時間に達したら削除
 * @param onDelete 削除時に実行する関数.引数に削除されるインスタンスとidを取る
 */
export function removeDieWaterRing(
  waterRings: IWaterRingRepository,
  onDelete: (waterRingId: string, waterRing: WaterRing) => void
): void {
  waterRings.getAllId().forEach((waterRingId: string) => {
    const waterRing = waterRings.get(waterRingId)
    if (waterRing?.isDead ?? false) {
      waterRings.delete(waterRingId)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onDelete(waterRingId, waterRing!) // null合体でundefinedでないことは確定
    }
  })
}
