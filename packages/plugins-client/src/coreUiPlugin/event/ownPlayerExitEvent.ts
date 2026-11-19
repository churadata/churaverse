import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class OwnPlayerExitEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('ownPlayerExit', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    ownPlayerExit: OwnPlayerExitEvent
  }
}
