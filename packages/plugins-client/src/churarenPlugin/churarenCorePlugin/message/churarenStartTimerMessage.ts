import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export class ChurarenStartTimerMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('churarenStartTimer')
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    churarenStartTimer: ChurarenStartTimerMessage
  }
}
