import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

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

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    synchroBreakStartCount: SynchroBreakStartCountMessage
  }
}
