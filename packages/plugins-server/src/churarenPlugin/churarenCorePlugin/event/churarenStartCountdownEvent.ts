import { CVEvent, type IMainScene } from 'churaverse-engine-server'

export class ChurarenStartCountdownEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('churarenStartCountdown', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    churarenStartCountdown: ChurarenStartCountdownEvent
  }
}
