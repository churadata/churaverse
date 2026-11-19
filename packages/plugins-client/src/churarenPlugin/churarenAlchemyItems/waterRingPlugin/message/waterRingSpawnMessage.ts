import type { Sendable, SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface WaterRingSpawnData extends SendableObject {
  waterRingId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class WaterRingSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: WaterRingSpawnData) {
    super('waterRingSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    waterRingSpawn: WaterRingSpawnMessage
  }
}
