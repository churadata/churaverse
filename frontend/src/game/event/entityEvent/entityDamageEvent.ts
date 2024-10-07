import { DamageCause } from '../../domain/model/damageCause'
import { CVEvent } from '../cvEvent'
import { IMainScene } from '../../scene/IScene/IMainScene'
import { Entity } from '../../domain/model/entity'

export class EntityDamageEvent extends CVEvent<IMainScene, 'entityDamage'> {
  public constructor(
    public readonly target: Entity,
    public readonly attacker: Entity,
    public readonly cause: DamageCause,
    public readonly amount: number
  ) {
    super('entityDamage', true)
  }
}

declare module '../../event/events' {
  export interface CVMainEventMap {
    entityDamage: EntityDamageEvent
  }
}
