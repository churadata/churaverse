import type { Sendable, SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-server'

export interface TornadoSpawnData extends SendableObject {
  tornadoId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class TornadoSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TornadoSpawnData) {
    super('tornadoSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    tornadoSpawn: TornadoSpawnMessage
  }
}
