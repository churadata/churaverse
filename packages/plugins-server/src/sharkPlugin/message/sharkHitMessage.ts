import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface SharkHitData extends SendableObject {
  sharkId: string
}

export class SharkHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SharkHitData) {
    super('sharkHit', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    sharkHit: SharkHitMessage
  }
}
