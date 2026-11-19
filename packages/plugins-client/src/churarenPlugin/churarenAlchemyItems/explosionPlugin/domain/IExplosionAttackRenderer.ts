import type { Position } from 'churaverse-engine-client'

export interface IExplosionAttackRenderer {
  /**
   * walk Phaserのtweenによりアニメーションするため,座標の同期をonUpdateでさせる
   * @param onUpdate updateごとに座標の通知
   */
  walk: (position: Position, dest: Position, onUpdate: (pos: Position) => void) => void
  dead: () => void
}
