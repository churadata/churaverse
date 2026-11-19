import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { ITitleScene } from 'churaverse-engine-server'
import type { PlayerNameColor } from '../playerNameColorCache'

export interface TitleParticipantUpdate {
  players: PlayerNameColor[]
}

export class TitleParticipantUpdateMessage extends BaseMessage<ITitleScene> {
  public constructor(data?: SendableObject) {
    super('titleParticipantUpdate', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface TitleMessageMap {
    titleParticipantUpdate: TitleParticipantUpdateMessage
  }
}
