import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface SharkHitData extends SendableObject {
  sharkId: string
}

export class SharkHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SharkHitData) {
    super('sharkHit', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    sharkHit: SharkHitMessage
  }
}
