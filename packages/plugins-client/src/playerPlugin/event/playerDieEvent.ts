import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class PlayerDieEvent extends CVEvent<IMainScene> {
  public constructor(public readonly id: string) {
    super('playerDie', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    playerDie: PlayerDieEvent
  }
}
