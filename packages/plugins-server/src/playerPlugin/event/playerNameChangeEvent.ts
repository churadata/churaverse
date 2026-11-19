import { CVEvent, type IMainScene } from 'churaverse-engine-server'

export class PlayerNameChangeEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly name: string
  ) {
    super('playerNameChange', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    playerNameChange: PlayerNameChangeEvent
  }
}
