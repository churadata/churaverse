import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class InvicibleTimeEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly invicibleTime: number
  ) {
    super('invicibleTime', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    invicibleTime: InvicibleTimeEvent
  }
}
