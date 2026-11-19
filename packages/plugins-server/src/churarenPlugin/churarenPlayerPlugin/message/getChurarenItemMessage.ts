import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface GetChurarenItemData extends SendableObject {
  playerId: string
  itemId: string
}

export class GetChurarenItemMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GetChurarenItemData) {
    super('getChurarenItem', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    getChurarenItem: GetChurarenItemMessage
  }
}
