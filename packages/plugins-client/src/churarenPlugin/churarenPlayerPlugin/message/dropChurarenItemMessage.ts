import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface DropChurarenItemData extends SendableObject {
  playerId: string
  itemId: string
}

export class DropChurarenItemMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: DropChurarenItemData) {
    super('dropChurarenItem', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    dropChurarenItem: DropChurarenItemMessage
  }
}
