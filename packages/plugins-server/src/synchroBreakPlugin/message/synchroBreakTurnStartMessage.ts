import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface SynchroBreakTurnStartData extends SendableObject {
  turnNumber: number
}

/**
 * ゲームターン開始を知らせる
 */
export class SynchroBreakTurnStartMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakTurnStartData) {
    super('synchroBreakTurnStart', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    synchroBreakTurnStart: SynchroBreakTurnStartMessage
  }
}
