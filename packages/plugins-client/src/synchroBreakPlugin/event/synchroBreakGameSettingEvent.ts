import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * シンクロブレイクターン/タイムリミット選択イベント
 * @param playerId ゲームのターン数を選択したプレイヤーのID
 * @param allTurn 選択されたゲームターン数
 * @param timeLimit シンクロブレイクゲームのタイムリミット
 */
export class SynchroBreakGameSettingEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly allTurn: number,
    public readonly timeLimit: string
  ) {
    super('synchroBreakGameSetting', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    synchroBreakGameSetting: SynchroBreakGameSettingEvent
  }
}
