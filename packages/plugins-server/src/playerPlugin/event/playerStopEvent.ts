import { CVEvent, type Direction, type IMainScene, type Position } from 'churaverse-engine-server'

export class PlayerStopEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly position: Position,
    public readonly direction: Direction
  ) {
    super('playerStop', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    playerStop: PlayerStopEvent
  }
}
