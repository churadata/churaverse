import type { Sendable, SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface BlackHoleSpawnData extends SendableObject {
  blackHoleId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class BlackHoleSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BlackHoleSpawnData) {
    super('blackHoleSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    blackHoleSpawn: BlackHoleSpawnMessage
  }
}
