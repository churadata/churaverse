import type { PlayerRole } from '@churaverse/shared-types-client'
import { CVEvent, type ITitleScene } from 'churaverse-engine-client'

export class TitlePlayerRoleChangeEvent extends CVEvent<ITitleScene> {
  public constructor(public readonly playerRole: PlayerRole) {
    super('titlePlayerRoleChange', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVTitleEventMap {
    titlePlayerRoleChange: TitlePlayerRoleChangeEvent
  }
}
