import type { Sendable, SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface ExplosionSpawnData extends SendableObject {
  explosionId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class ExplosionSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ExplosionSpawnData) {
    super('explosionSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    explosionSpawn: ExplosionSpawnMessage
  }
}
