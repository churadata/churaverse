import { ISharkRepository } from '../IRepository/ISharkRepository'
import { Shark } from '../model/shark'
import { WorldMap } from '../model/worldMap'

/**
 * 衝突した or 消滅時間に達したサメを削除
 * @param onDelete 削除時に実行する関数.引数に削除されるサメのインスタンスとidを取る
 */
export function removeDieShark(sharks: ISharkRepository, onDelete: (sharkId: string, shark: Shark) => void): void {
  sharks.getAllId().forEach((sharkId) => {
    const shark = sharks.get(sharkId)
    if (shark?.isDead ?? false) {
      sharks.delete(sharkId)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onDelete(sharkId, shark!) // null合体でundefinedでないことは確定
    }
  })
}

/**
 * SharkRepository内の全サメを微小時間分だけ移動
 * その際にワールド外に出たサメをdie
 */
export function moveSharks(dt: number, sharks: ISharkRepository, worldMap: WorldMap): void {
  sharks.getAllId().forEach((sharkId) => {
    const shark = sharks.get(sharkId)
    if (shark !== undefined) {
      shark.move(dt)
      if (
        shark.position.x < 0 ||
        shark.position.x > worldMap.width ||
        shark.position.y < 0 ||
        shark.position.y > worldMap.height
      ) {
        shark.die()
      } else {
        sharks.updateActor(sharkId, shark)
      }
    }
  })
}
