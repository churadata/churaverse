import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface DropChurarenItemData extends SendableObject {
  playerId: string
  itemId: string
}

export class DropChurarenItemMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: DropChurarenItemData) {
    super('dropChurarenItem', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    dropChurarenItem: DropChurarenItemMessage
  }
}
