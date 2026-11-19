import type { Sendable, SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface BossAttackSpawnData extends SendableObject {
  bossAttackId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class BossAttackSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossAttackSpawnData) {
    super('bossAttackSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    bossAttackSpawn: BossAttackSpawnMessage
  }
}
