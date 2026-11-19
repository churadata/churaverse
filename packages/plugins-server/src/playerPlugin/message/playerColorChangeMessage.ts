import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import type { PlayerColor } from '../types/playerColor'

export interface PlayerColorChangeData extends SendableObject {
  color: PlayerColor
}

export class PlayerColorChangeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerColorChangeData) {
    super('playerColorChange', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerColorChange: PlayerColorChangeMessage
  }
}
