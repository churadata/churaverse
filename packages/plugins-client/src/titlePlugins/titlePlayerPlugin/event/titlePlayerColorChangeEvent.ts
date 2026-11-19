import type { PlayerColor } from '@churaverse/player-plugin-client'
import { CVEvent, type ITitleScene } from 'churaverse-engine-client'

export class TitlePlayerColorChangeEvent extends CVEvent<ITitleScene> {
  public constructor(public readonly color: PlayerColor) {
    super('titlePlayerColorChange', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVTitleEventMap {
    titlePlayerColorChange: TitlePlayerColorChangeEvent
  }
}
