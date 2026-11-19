import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export class ChurarenStartCountdownMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('churarenStartCountdown')
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    churarenStartCountdown: ChurarenStartCountdownMessage
  }
}
