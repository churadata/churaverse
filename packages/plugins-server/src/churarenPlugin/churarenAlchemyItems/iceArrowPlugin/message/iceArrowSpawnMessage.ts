import type { Sendable, SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-server'

export interface IceArrowSpawnData extends SendableObject {
  iceArrowId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
  attackVector: Vector & Sendable
}

export class IceArrowSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: IceArrowSpawnData) {
    super('iceArrowSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    iceArrowSpawn: IceArrowSpawnMessage
  }
}
