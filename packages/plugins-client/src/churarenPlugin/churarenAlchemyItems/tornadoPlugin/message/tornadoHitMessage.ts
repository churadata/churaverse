import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface TornadoHitData extends SendableObject {
  tornadoId: string
}

export class TornadoHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TornadoHitData) {
    super('tornadoHit', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    tornadoHit: TornadoHitMessage
  }
}
