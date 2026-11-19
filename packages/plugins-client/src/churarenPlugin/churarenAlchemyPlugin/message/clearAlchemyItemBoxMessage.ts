import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface ClearAlchemyItemBoxData extends SendableObject {
  playerId: string
}

export class ClearAlchemyItemBoxMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ClearAlchemyItemBoxData) {
    super('clearAlchemyItemBox', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    clearAlchemyItemBox: ClearAlchemyItemBoxMessage
  }
}
