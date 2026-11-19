import type { WorldMap } from '@churaverse/map-plugin-server'
import type { ITornadoRepository } from './ITornadoRepository'
import type { Tornado } from './tornado'

/**
 * 衝突した or 消滅時間に達した竜巻を削除
 * @param onDelete 削除時に実行する関数.引数に削除される竜巻のインスタンスとidを取る
 */
export function removeDieTornado(
  tornados: ITornadoRepository,
  onDelete: (tornadoId: string, tornado: Tornado) => void
): void {
  tornados.getAllId().forEach((tornadoId: string) => {
    const tornado = tornados.get(tornadoId)
    if (tornado?.isDead ?? false) {
      tornados.delete(tornadoId)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onDelete(tornadoId, tornado!) // null合体でundefinedでないことは確定
    }
  })
}

/**
 * TornadoRepository内の全竜巻を微小時間分だけ移動
 * その際にワールド外に出た竜巻をdie
 */
export function moveTornados(dt: number, tornados: ITornadoRepository, worldMap: WorldMap): void {
  tornados.getAllId().forEach((tornadoId: string) => {
    const tornado = tornados.get(tornadoId)
    if (tornado !== undefined) {
      tornado.move(dt)
      if (
        tornado.position.x < 0 ||
        tornado.position.x > worldMap.width ||
        tornado.position.y < 0 ||
        tornado.position.y > worldMap.height
      ) {
        tornado.die()
      } else {
        tornados.updateActor(tornadoId, tornado)
      }
    }
  })
}
