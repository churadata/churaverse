import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface BlackHoleDespawnData extends SendableObject {
  blackHoleId: string
}

export class BlackHoleDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BlackHoleDespawnData) {
    super('blackHoleDespawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    blackHoleDespawn: BlackHoleDespawnMessage
  }
}
