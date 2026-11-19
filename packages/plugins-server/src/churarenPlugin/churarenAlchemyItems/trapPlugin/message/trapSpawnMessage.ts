import type { Sendable, SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-server'

export interface TrapSpawnData extends SendableObject {
  trapId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class TrapSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TrapSpawnData) {
    super('trapSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    trapSpawn: TrapSpawnMessage
  }
}
