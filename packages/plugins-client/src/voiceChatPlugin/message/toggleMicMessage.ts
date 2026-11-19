import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface ToggleMicData extends SendableObject {
  playerId: string
  isUnmute: boolean
}

export class ToggleMicMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ToggleMicData) {
    super('toggleMic', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    toggleMic: ToggleMicMessage
  }
}
