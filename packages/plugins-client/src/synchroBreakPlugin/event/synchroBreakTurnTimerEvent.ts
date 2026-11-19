import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * シンクロブレイクのターンタイマーイベント
 * @param remainingSeconds ターン終了までの残り秒数
 */
export class SynchroBreakTurnTimerEvent extends CVEvent<IMainScene> {
  public constructor(public readonly remainingSeconds: number) {
    super('synchroBreakTurnTimer', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    synchroBreakTurnTimer: SynchroBreakTurnTimerEvent
  }
}
