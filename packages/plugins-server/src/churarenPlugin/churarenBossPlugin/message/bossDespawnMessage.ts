import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface DespawnBossData extends SendableObject {
  bossId: string
}

export class BossDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: DespawnBossData) {
    super('bossDespawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    bossDespawn: BossDespawnMessage
  }
}
