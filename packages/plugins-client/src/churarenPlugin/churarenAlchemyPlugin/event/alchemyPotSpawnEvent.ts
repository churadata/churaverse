import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { AlchemyPot } from '../domain/alchemyPot'

export class AlchemyPotSpawnEvent extends CVEvent<IMainScene> {
  public constructor(public readonly alchemyPots: AlchemyPot[]) {
    super('alchemyPotSpawn', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    alchemyPotSpawn: AlchemyPotSpawnEvent
  }
}
