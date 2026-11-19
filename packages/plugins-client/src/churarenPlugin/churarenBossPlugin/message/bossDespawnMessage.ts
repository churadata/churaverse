import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface BossDespawnData extends SendableObject {
  bossId: string
}

export class BossDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossDespawnData) {
    super('bossDespawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    bossDespawn: BossDespawnMessage
  }
}
