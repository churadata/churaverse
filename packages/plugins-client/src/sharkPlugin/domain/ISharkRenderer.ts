import type { Direction, Position } from 'churaverse-engine-client'

/**
 * サメ描画のためのインタフェース
 */
export interface ISharkRenderer {
  setSpriteId: (id: string) => void
  /**
   * walk Phaserのtweenによりアニメーションするため,座標の同期をonUpdateでさせる
   * @param onUpdate updateごとに座標の通知
   */
  walk: (position: Position, dest: Position, direction: Direction, onUpdate: (pos: Position) => void) => void
  dead: () => void
}
