import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface BlackHoleDespawnData extends SendableObject {
  blackHoleId: string
}

export class BlackHoleDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BlackHoleDespawnData) {
    super('blackHoleDespawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    blackHoleDespawn: BlackHoleDespawnMessage
  }
}
