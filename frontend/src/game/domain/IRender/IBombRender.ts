import { Position } from '../model/core/position'

/**
 * BombRenderの抽象
 * 主語はBomb
 */
export interface IBombRender {
  drop: (source: Position) => void
  explode: () => void
  destroy: () => void
}
