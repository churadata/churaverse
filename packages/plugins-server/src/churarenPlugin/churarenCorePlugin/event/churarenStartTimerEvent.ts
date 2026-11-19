import { CVEvent, type IMainScene } from 'churaverse-engine-server'

export class ChurarenStartTimerEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('churarenStartTimer', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    churarenStartTimer: ChurarenStartTimerEvent
  }
}
