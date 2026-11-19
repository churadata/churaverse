import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface PlayerRevivalData extends SendableObject {
  playerId: string
}

export class PlayerRevivalMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerRevivalData) {
    super('playerRevival', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    playerRevival: PlayerRevivalMessage
  }
}
