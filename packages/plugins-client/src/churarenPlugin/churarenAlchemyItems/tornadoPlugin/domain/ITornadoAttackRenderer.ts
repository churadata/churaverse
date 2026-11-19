import type { Position } from 'churaverse-engine-client'

/**
 * TornadoRenderの抽象
 * 主語はTornado
 */
export interface ITornadoAttackRenderer {
  /**
   * walk Phaserのtweenによりアニメーションするため,座標の同期をonUpdateでさせる
   * @param onUpdate updateごとに座標の通知
   */
  walk: (position: Position, dest: Position, onUpdate: (pos: Position) => void, onComplete: () => void) => void
  dead: () => void
}
