import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 * ターン開始時のイベント
 * @param turnNumber 現在のゲームターン数
 */
export class SynchroBreakTurnStartEvent extends CVEvent<IMainScene> {
  public constructor(public readonly turnNumber: number) {
    super('synchroBreakTurnStart', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    synchroBreakTurnStart: SynchroBreakTurnStartEvent
  }
}
