import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface WaterRingHitData extends SendableObject {
  waterRingId: string
}

export class WaterRingHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: WaterRingHitData) {
    super('waterRingHit', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    waterRingHit: WaterRingHitMessage
  }
}
