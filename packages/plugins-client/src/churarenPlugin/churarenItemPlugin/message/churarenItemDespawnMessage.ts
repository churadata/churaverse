import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface ChurarenItemDespawnData extends SendableObject {
  itemIds: string[]
}

export class ChurarenItemDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenItemDespawnData) {
    super('churarenItemDespawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    churarenItemDespawn: ChurarenItemDespawnMessage
  }
}
