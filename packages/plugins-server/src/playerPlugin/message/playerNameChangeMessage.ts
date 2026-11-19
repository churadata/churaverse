import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface PlayerNameChangeData extends SendableObject {
  name: string
}

export class PlayerNameChangeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerNameChangeData) {
    super('playerNameChange', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerNameChange: PlayerNameChangeMessage
  }
}
