import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface WaterRingDespawnData extends SendableObject {
  waterRingId: string
}

export class WaterRingDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: WaterRingDespawnData) {
    super('waterRingDespawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    waterRingDespawn: WaterRingDespawnMessage
  }
}
