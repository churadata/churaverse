import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface PlayerRevivalData extends SendableObject {
  playerId: string
}

export class PlayerRevivalMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerRevivalData) {
    super('playerRevival', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerRevival: PlayerRevivalMessage
  }
}
