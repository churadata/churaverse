import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface ExplosionHitData extends SendableObject {
  explosionId: string
}

export class ExplosionHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ExplosionHitData) {
    super('explosionHit', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    explosionHit: ExplosionHitMessage
  }
}
