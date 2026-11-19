import type { Sendable, SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-server'

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

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    waterRingSpawn: WaterRingSpawnMessage
  }
}
