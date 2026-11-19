import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface SynchroBreakGameSettingData extends SendableObject {
  playerId: string
  allTurn: number
  timeLimit: string
}

/**
 * プレイヤーがゲームターン数を選択した際のメッセージ
 */
export class SynchroBreakGameSettingMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakGameSettingData) {
    super('synchroBreakGameSetting', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    synchroBreakGameSetting: SynchroBreakGameSettingMessage
  }
}
