import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface SynchroBreakTurnEndData extends SendableObject {
  noNyokkiPlayerIds: string[]
}

/**
 * ゲームターン終了を知らせる
 */
export class SynchroBreakTurnEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakTurnEndData) {
    super('synchroBreakTurnEnd', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    synchroBreakTurnEnd: SynchroBreakTurnEndMessage
  }
}
