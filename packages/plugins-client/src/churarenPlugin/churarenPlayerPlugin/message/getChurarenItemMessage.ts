import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface GetChurarenItemData extends SendableObject {
  playerId: string
  itemId: string
}

export class GetChurarenItemMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GetChurarenItemData) {
    super('getChurarenItem', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    getChurarenItem: GetChurarenItemMessage
  }
}
