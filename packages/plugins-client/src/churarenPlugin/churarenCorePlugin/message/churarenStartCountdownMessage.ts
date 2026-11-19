import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export class ChurarenStartCountdownMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('churarenStartCountdown')
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    churarenStartCountdown: ChurarenStartCountdownMessage
  }
}
