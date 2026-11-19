import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface ClearAlchemyItemBoxData extends SendableObject {
  playerId: string
}

export class ClearAlchemyItemBoxMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ClearAlchemyItemBoxData) {
    super('clearAlchemyItemBox', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    clearAlchemyItemBox: ClearAlchemyItemBoxMessage
  }
}
