import { CVEvent, type ITitleScene } from 'churaverse-engine-client'
import type { PlayerNameColor } from '../message/titlePriorPlayerDataMessage'

export class TitlePlayerListReceivedEvent extends CVEvent<ITitleScene> {
  public constructor(public readonly players: PlayerNameColor[]) {
    super('titlePlayerListReceived', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVTitleEventMap {
    titlePlayerListReceived: TitlePlayerListReceivedEvent
  }
}
