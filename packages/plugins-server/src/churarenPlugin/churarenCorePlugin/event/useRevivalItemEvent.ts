import { CVEvent, type IMainScene } from 'churaverse-engine-server'

export class UseRevivalItemEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('useRevivalItem', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    useRevivalItem: UseRevivalItemEvent
  }
}
