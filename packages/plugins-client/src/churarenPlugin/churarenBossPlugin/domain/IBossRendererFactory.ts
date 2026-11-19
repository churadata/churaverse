import type { Position } from 'churaverse-engine-client'
import type { IBossRenderer } from './IBossRenderer'

export interface IBossRendererFactory {
  build: (posistion: Position, bossHP: number) => IBossRenderer
}
