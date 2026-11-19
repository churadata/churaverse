import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { ResultScreenType } from '../type/resultScreenType'

/**
 * ゲーム結果ウィンドウ表示イベント
 */
export class SynchroBreakResultEvent extends CVEvent<IMainScene> {
  public constructor(public readonly resultScreenType: ResultScreenType) {
    super('synchroBreakResult', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    synchroBreakResult: SynchroBreakResultEvent
  }
}
