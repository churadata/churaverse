import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface BombSpawnData extends SendableObject {
  bombId: string
  startPos: Vector & SendableObject
  direction: Direction
  spawnTime: number
}

export class BombSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BombSpawnData) {
    super('bombSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    bombSpawn: BombSpawnMessage
  }
}
