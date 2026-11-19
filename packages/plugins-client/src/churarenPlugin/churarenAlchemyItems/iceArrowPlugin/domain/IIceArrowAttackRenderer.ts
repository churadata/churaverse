import type { Direction, Position, Vector } from 'churaverse-engine-client'

export interface IIceArrowAttackRenderer {
  /**
   * walk Phaserのtweenによりアニメーションするため,座標の同期をonUpdateでさせる
   * @param onUpdate updateごとに座標の通知
   * @returns
   */
  walk: (
    position: Position,
    dest: Position,
    direction: Direction,
    attackVector: Vector,
    onUpdate: (pos: Position) => void
  ) => void
  dead: () => void
}
