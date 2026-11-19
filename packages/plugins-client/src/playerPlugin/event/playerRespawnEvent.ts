import { CVEvent, type Direction, type IMainScene, type Position } from 'churaverse-engine-client'

export class PlayerRespawnEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly position: Position,
    public readonly direction: Direction
  ) {
    super('playerRespawn', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    playerRespawn: PlayerRespawnEvent
  }
}
