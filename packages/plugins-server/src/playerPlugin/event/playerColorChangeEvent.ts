import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { PlayerColor } from '../types/playerColor'

export class PlayerColorChangeEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly color: PlayerColor
  ) {
    super('playerColorChange', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    playerColorChange: PlayerColorChangeEvent
  }
}
