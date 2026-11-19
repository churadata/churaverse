import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface TrapHitData extends SendableObject {
  trapId: string
}

export class TrapHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TrapHitData) {
    super('trapHit', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    trapHit: TrapHitMessage
  }
}
