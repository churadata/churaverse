import type { Position } from 'churaverse-engine-client'

export interface IAlchemyItemRenderer {
  chase: (dest: Position, speed: number, onUpdate: (pos: Position) => void) => void
  destroy: () => void
}
