import type { Position } from 'churaverse-engine-client'

/**
 * WaterRingRenderの抽象
 * 主語はWaterRing
 */
export interface IWaterRingAttackRenderer {
  spawn: (source: Position) => void
  chase: (dest: Position, speed: number, onUpdate: (pos: Position) => void) => void
  dead: () => void
}
