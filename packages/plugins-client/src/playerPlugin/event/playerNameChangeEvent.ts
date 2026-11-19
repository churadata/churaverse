import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class PlayerNameChangeEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly name: string
  ) {
    super('playerNameChange', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    playerNameChange: PlayerNameChangeEvent
  }
}
