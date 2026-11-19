import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface WaterRingDespawnData extends SendableObject {
  waterRingId: string
}

export class WaterRingDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: WaterRingDespawnData) {
    super('waterRingDespawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    waterRingDespawn: WaterRingDespawnMessage
  }
}
