import type { Sendable, SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface FlamePillarSpawnData extends SendableObject {
  flamePillarId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class FlamePillarSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: FlamePillarSpawnData) {
    super('flamePillarSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    flamePillarSpawn: FlamePillarSpawnMessage
  }
}
