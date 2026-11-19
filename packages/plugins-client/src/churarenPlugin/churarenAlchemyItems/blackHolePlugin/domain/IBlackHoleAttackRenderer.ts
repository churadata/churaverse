import type { Position } from 'churaverse-engine-client'

/**
 * BlackHoleAttackRenderの抽象
 * 主語はBlackHole
 */
export interface IBlackHoleAttackRenderer {
  move: (pos: Position, dest: Position, onUpdate: (pos: Position) => void) => void
  dead: () => void
}
