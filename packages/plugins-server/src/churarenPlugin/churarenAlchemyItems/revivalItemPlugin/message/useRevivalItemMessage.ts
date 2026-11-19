import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface UseRevivalItemData extends SendableObject {
  playerId: string
}

export class UseRevivalItemMessage extends BaseMessage<IMainScene> {
  public constructor(public data: UseRevivalItemData) {
    super('useRevivalItem', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    useRevivalItem: UseRevivalItemMessage
  }
}
