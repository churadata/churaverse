import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface SynchroBreakTurnTimerMessageData extends SendableObject {
  remainingSeconds: number
}

/**
 * ターン進行中の残り時間(秒数)を送信するメッセージ
 */
export class SynchroBreakTurnTimerMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakTurnTimerMessageData) {
    super('synchroBreakTurnTimer', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    synchroBreakTurnTimer: SynchroBreakTurnTimerMessage
  }
}
