import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface SynchroBreakTurnEndData extends SendableObject {
  noNyokkiPlayerIds: string[]
}

/**
 * ゲームターン終了を知らせる
 */
export class SynchroBreakTurnEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakTurnEndData) {
    super('synchroBreakTurnEnd')
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    synchroBreakTurnEnd: SynchroBreakTurnEndMessage
  }
}
