import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class ChurarenStartTimerEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('churarenStartTimer', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    churarenStartTimer: ChurarenStartTimerEvent
  }
}
