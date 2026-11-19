import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface GhostModeData extends SendableObject {
  playerId: string
}

export class GhostModeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GhostModeData) {
    super('ghostMode', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    ghostMode: GhostModeMessage
  }
}
