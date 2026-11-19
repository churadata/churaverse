import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'
import type { ResultScreenType } from '../type/resultScreenType'

export interface SynchroBreakResultMessageData extends SendableObject {
  resultScreenType: ResultScreenType
}

/**
 * ゲーム終了後の結果ウィンドウ表示メッセージ
 */
export class SynchroBreakResultMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakResultMessageData) {
    super('synchroBreakResult', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    synchroBreakResult: SynchroBreakResultMessage
  }
}
