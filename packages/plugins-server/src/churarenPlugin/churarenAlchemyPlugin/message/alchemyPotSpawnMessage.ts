import type { Sendable, SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene, Vector } from 'churaverse-engine-server'

export interface AlchemyPotInfo extends SendableObject {
  potId: string
  spawnPos: Vector & Sendable
}

export type AlchemyPotMap = Record<string, AlchemyPotInfo>

export interface AlchemyPotSpawnData extends SendableObject {
  pots: AlchemyPotMap
}

export class AlchemyPotSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: AlchemyPotSpawnData) {
    super('alchemyPotSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    alchemyPotSpawn: AlchemyPotSpawnMessage
  }
}
