import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface IceArrowHitData extends SendableObject {
  iceArrowId: string
}

export class IceArrowHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: IceArrowHitData) {
    super('iceArrowHit', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    iceArrowHit: IceArrowHitMessage
  }
}
