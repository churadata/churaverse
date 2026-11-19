import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface InvicibleTimeData extends SendableObject {
  playerId: string
  invicibleTime: number
}

export class InvicibleTimeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: InvicibleTimeData) {
    super('invicibleTime', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    invicibleTime: InvicibleTimeMessage
  }
}
