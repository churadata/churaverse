import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface SynchroBreakGameSettingData extends SendableObject {
  playerId: string
  timeLimit: string
  allTurn: number
}

/**
 * タイムリミットとターン数が設定された際のメッセージ
 */
export class SynchroBreakGameSettingMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakGameSettingData) {
    super('synchroBreakGameSetting', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    synchroBreakGameSetting: SynchroBreakGameSettingMessage
  }
}
