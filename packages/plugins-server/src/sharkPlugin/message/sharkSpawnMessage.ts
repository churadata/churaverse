import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-server'

export interface SharkSpawnData extends SendableObject {
  sharkId: string
  startPos: Vector & SendableObject
  direction: Direction
  spawnTime: number
}

export class SharkSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SharkSpawnData) {
    super('sharkSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    sharkSpawn: SharkSpawnMessage
  }
}
