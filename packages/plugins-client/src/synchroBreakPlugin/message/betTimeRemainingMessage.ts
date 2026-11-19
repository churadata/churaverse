import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface BetTimeRemainingData extends SendableObject {
  remainingTime: number
}

/**
 * 残りのベットタイムメッセージ
 */
export class BetTimeRemainingMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BetTimeRemainingData) {
    super('betTimeRemaining', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    betTimeRemaining: BetTimeRemainingMessage
  }
}
