import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import type { ChurarenGameResultType } from '../types/uiTypes'

export interface ChurarenResultData extends SendableObject {
  resultType: ChurarenGameResultType
}

export class ChurarenResultMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenResultData) {
    super('churarenResult', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    churarenResult: ChurarenResultMessage
  }
}
