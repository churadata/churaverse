import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface IceArrowHitData extends SendableObject {
  iceArrowId: string
}

export class IceArrowHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: IceArrowHitData) {
    super('iceArrowHit', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    iceArrowHit: IceArrowHitMessage
  }
}
