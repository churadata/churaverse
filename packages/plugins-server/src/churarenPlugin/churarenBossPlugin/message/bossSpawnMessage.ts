import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene, Vector } from 'churaverse-engine-server'

export interface BossSpawnData extends SendableObject {
  bossId: string
  startPos: Vector & SendableObject
  spawnTime: number
  bossHp: number
}

export class BossSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossSpawnData) {
    super('bossSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    bossSpawn: BossSpawnMessage
  }
}
