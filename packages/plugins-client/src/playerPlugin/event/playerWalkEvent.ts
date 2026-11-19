import { CVEvent, type Direction, type IMainScene, type Position } from 'churaverse-engine-client'

export class PlayerWalkEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly direction: Direction,
    public readonly speed?: number,
    public readonly source?: Position
  ) {
    super('playerWalk', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    playerWalk: PlayerWalkEvent
  }
}
