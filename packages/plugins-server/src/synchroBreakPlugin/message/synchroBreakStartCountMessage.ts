import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface SynchroBreakStartCountMessageData extends SendableObject {
  remainingSeconds: number
}

/**
 * シンクロブレイクの開始カウントダウンメッセージ
 */
export class SynchroBreakStartCountMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakStartCountMessageData) {
    super('synchroBreakStartCount', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    synchroBreakStartCount: SynchroBreakStartCountMessage
  }
}
