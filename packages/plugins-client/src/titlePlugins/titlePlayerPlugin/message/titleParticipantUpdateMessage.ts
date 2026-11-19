import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { Scenes } from 'churaverse-engine-client'

export interface PlayerNameColor {
  name: string
  color: string
  company?: string // SSO 導入後に会社名が入る
}

export interface TitleParticipantUpdate {
  players: PlayerNameColor[]
}

export class TitleParticipantUpdateMessage extends BaseMessage<Scenes> {
  public constructor(data?: SendableObject) {
    super('titleParticipantUpdate', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface TitleMessageMap {
    titleParticipantUpdate: TitleParticipantUpdateMessage
  }
}
