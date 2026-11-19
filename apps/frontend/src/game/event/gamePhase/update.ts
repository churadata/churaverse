import { CVEvent } from '../cvEvent'
import { Scenes } from '../../scene/types'

export class UpdateEvent extends CVEvent<Scenes, 'update'> {
  public constructor(public readonly time: number, public readonly dt: number) {
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
