import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { ChurarenGameResultType } from '../types/uiTypes'

export class ChurarenResultEvent extends CVEvent<IMainScene> {
  public constructor(public readonly resultType: ChurarenGameResultType) {
    super('churarenResult', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    churarenResult: ChurarenResultEvent
  }
}
