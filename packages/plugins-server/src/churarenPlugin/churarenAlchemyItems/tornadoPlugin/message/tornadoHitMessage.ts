import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface TornadoHitData extends SendableObject {
  tornadoId: string
}

export class TornadoHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TornadoHitData) {
    super('tornadoHit', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    tornadoHit: TornadoHitMessage
  }
}
