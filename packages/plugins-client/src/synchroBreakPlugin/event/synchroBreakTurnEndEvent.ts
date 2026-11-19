import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * ターン終了時のイベント
 */
export class SynchroBreakTurnEndEvent extends CVEvent<IMainScene> {
  public constructor(public readonly noNyokkiPlayerIds: string[]) {
    super('synchroBreakTurnEnd', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    synchroBreakTurnEnd: SynchroBreakTurnEndEvent
  }
}
