import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface BetTimeRemainingData extends SendableObject {
  remainingTime: number
}

/**
 * ベット残り時間のレスポンスを返すメッセージ
 */
export class BetTimeRemainingMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BetTimeRemainingData) {
    super('betTimeRemaining', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    betTimeRemaining: BetTimeRemainingMessage
  }
}
