import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export class ChurarenStartTimerMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('churarenStartTimer')
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    churarenStartTimer: ChurarenStartTimerMessage
  }
}
