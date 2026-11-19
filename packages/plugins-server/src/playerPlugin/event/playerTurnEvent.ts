import { CVEvent, type Direction, type IMainScene } from 'churaverse-engine-server'

export class PlayerTurnEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly direction: Direction
  ) {
    super('playerTurn', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    playerTurn: PlayerTurnEvent
  }
}
