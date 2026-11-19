import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class PlayerInvincibleTimeEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly invincibleTime: number
  ) {
    super('playerInvincibleTime', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    playerInvincibleTime: PlayerInvincibleTimeEvent
  }
}
