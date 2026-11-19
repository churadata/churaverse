import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface PlayerNameChangeData extends SendableObject {
  name: string
}

export class PlayerNameChangeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerNameChangeData) {
    super('playerNameChange', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    playerNameChange: PlayerNameChangeMessage
  }
}
