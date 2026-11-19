import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { ITitleScene } from 'churaverse-engine-server'
import type { PlayerNameColor } from '../playerNameColorCache'

export interface TitlePriorPlayerData {
  players: PlayerNameColor[]
}

export class TitlePriorPlayerDataMessage extends BaseMessage<ITitleScene> {
  public constructor(data?: SendableObject) {
    super('titlePriorPlayerData', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface TitleMessageMap {
    titlePriorPlayerData: TitlePriorPlayerDataMessage
  }
}
