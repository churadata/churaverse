import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface ChurarenItemDespawnData extends SendableObject {
  itemIds: string[]
}

export class ChurarenItemDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenItemDespawnData) {
    super('churarenItemDespawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    churarenItemDespawn: ChurarenItemDespawnMessage
  }
}
