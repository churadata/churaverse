import { CVEvent, type Direction, type IMainScene, type Position } from 'churaverse-engine-server'

export class PlayerWalkEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly position: Position,
    public readonly direction: Direction,
    public readonly speed: number
  ) {
    super('playerWalk', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    playerWalk: PlayerWalkEvent
  }
}
