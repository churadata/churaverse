import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 * ターン終了時のイベント
 */
export class SynchroBreakTurnEndEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('synchroBreakTurnEnd', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    synchroBreakTurnEnd: SynchroBreakTurnEndEvent
  }
}
