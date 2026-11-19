import type { Position } from 'churaverse-engine-client'

export interface IItemRenderer {
  spawn: (source: Position) => void
  chase: (dest: Position, speed: number, onUpdate: (pos: Position) => void) => void
  destroy: () => void
}
