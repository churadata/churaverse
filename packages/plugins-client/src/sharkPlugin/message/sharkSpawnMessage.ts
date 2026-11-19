import { BaseMessage, type Sendable, type SendableObject } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface SharkSpawnData extends SendableObject {
  sharkId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class SharkSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SharkSpawnData) {
    super('sharkSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    sharkSpawn: SharkSpawnMessage
  }
}
