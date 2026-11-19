import type { Position } from 'churaverse-engine-client'

/**
 * BombRenderの抽象
 * 主語はBomb
 */
export interface IBombRenderer {
  drop: (source: Position) => void
  explode: () => void
  destroy: () => void
}
