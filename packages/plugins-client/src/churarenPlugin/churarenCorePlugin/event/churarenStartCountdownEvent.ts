import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class ChurarenStartCountdownEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('churarenStartCountdown', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    churarenStartCountdown: ChurarenStartCountdownEvent
  }
}
