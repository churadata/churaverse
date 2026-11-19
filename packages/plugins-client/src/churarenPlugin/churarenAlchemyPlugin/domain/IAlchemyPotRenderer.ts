import type { Position } from 'churaverse-engine-client'

export interface IAlchemyPotRenderer {
  spawn: (position: Position) => void
  destroy: () => void
}
