import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface SynchroBreakTurnStartData extends SendableObject {
  turnNumber: number
}

/**
 * ゲームターン開始を知らせる
 */
export class SynchroBreakTurnStartMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakTurnStartData) {
    super('synchroBreakTurnStart')
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    synchroBreakTurnStart: SynchroBreakTurnStartMessage
  }
}
