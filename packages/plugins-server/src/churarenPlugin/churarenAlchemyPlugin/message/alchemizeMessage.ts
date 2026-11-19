import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import type { AlchemyItemKind } from '../domain/alchemyItemKind'

export interface AlchemizeData extends SendableObject {
  playerId: string
  itemId: string
  kind: AlchemyItemKind
  deletedItemIds: string[]
}

export class AlchemizeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: AlchemizeData) {
    super('alchemize', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    alchemize: AlchemizeMessage
  }
}
