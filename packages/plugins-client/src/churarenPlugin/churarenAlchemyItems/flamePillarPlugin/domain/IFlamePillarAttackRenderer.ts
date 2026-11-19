import type { Position } from 'churaverse-engine-client'

export interface IFlamePillarAttackRenderer {
  spawn: (source: Position) => void
  dead: () => void
}
