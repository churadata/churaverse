import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface InvicibleTimeData extends SendableObject {
  playerId: string
  invicibleTime: number
}

export class InvicibleTimeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: InvicibleTimeData) {
    super('invicibleTime', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    invicibleTime: InvicibleTimeMessage
  }
}
