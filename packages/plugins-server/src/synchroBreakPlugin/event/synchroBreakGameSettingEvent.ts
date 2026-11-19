import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 * プレイヤーがゲームターン数とタイムリミットを設定した際のイベント
 * @param allTurn 選択されたゲームターン数
 * @param playerId タイムリミットを設定したプレイヤーのid
 * @param timeLimit シンクロブレイクゲームのタイムリミット
 */
export class SynchroBreakGameSettingEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly allTurn: number,
    public readonly playerId: string,
    public readonly timeLimit: string
  ) {
    super('synchroBreakGameSetting', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    synchroBreakGameSetting: SynchroBreakGameSettingEvent
  }
}
