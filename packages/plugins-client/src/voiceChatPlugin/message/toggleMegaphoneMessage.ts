import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface ToggleMegaphoneData extends SendableObject {
  playerId: string
  active: boolean
}

export class ToggleMegaphoneMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ToggleMegaphoneData) {
    super('toggleMegaphone', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    toggleMegaphone: ToggleMegaphoneMessage
  }
}
