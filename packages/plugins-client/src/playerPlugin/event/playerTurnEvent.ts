import { CVEvent, type Direction, type IMainScene } from 'churaverse-engine-client'

export class PlayerTurnEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly direction: Direction
  ) {
    super('playerTurn', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    playerTurn: PlayerTurnEvent
  }
}
