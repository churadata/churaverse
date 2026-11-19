import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface UseRevivalItemData extends SendableObject {
  playerId: string
}

export class UseRevivalItemMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: UseRevivalItemData) {
    super('useRevivalItem', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    useRevivalItem: UseRevivalItemMessage
  }
}
