import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class PlayerRevivalEvent extends CVEvent<IMainScene> {
  public constructor(public readonly id: string) {
    super('playerRevival', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    playerRevival: PlayerRevivalEvent
  }
}
