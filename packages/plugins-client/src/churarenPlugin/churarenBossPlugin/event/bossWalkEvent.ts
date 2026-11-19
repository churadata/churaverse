import { CVEvent, type Direction, type IMainScene, type Position } from 'churaverse-engine-client'

export class BossWalkEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly direction: Direction,
    public readonly position: Position,
    public readonly dest: Position,
    public readonly speed: number
  ) {
    super('bossWalk', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    bossWalk: BossWalkEvent
  }
}
