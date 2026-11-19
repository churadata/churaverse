import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * シンクロブレイクの開始カウントイベント
 * @param remainingSeconds ゲーム開始までの残り秒数
 */
export class SynchroBreakStartCountEvent extends CVEvent<IMainScene> {
  public constructor(public readonly remainingSeconds: number) {
    super('synchroBreakStartCount', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    synchroBreakStartCount: SynchroBreakStartCountEvent
  }
}
