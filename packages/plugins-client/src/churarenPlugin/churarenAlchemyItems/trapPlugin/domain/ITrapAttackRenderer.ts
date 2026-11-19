import type { Position } from 'churaverse-engine-client'

/**
 * TrapRenderの抽象
 * 主語はTrap
 */
export interface ITrapAttackRenderer {
  spawn: (source: Position) => void
  collide: () => void
  dead: () => void
}
