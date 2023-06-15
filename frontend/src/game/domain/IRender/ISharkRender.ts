import { Direction } from '../model/core/direction'
import { Position } from '../model/core/position'

/**
 * SharkRenderの抽象
 * 主語はShark
 */
export interface ISharkRender {
  setSpriteId: (id: string) => void
  /**
   * walk Phaserのtweenによりアニメーションするため,座標の同期をonUpdateでさせる
   * @param onUpdate updateごとに座標の通知
   */
  walk: (
    position: Position,
    dest: Position,
    direction: Direction,
    daley: number,
    onUpdate: (pos: Position) => void
  ) => void
  dead: () => void
}
