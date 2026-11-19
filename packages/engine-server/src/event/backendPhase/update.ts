import type { Scenes } from '../../scene/types'
import { CVEvent } from '../cvEvent'

export class UpdateEvent extends CVEvent<Scenes> {
  public constructor(
    public readonly time: number,
    public readonly dt: number
  ) {
    super('update', false)
  }
}

declare module '../events' {
  export interface CVTitleEventMap {
    update: UpdateEvent
  }
  export interface CVMainEventMap {
    update: UpdateEvent
  }
}
