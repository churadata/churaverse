import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface TrapHitData extends SendableObject {
  trapId: string
}

export class TrapHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TrapHitData) {
    super('trapHit', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    trapHit: TrapHitMessage
  }
}
