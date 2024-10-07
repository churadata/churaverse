import { DamageCause } from '../../domain/model/damageCause'
import { LivingEntity } from '../../domain/model/livingEntity'
import { IMainScene } from '../../scene/IScene/IMainScene'
import { CVEvent } from '../cvEvent'

/**
 * LivingEntityがダメージを受けたときに発生するイベント
 */
export class LivingDamageEvent extends CVEvent<IMainScene, 'livingDamage'> {
  public constructor(
    public readonly target: LivingEntity,
    public readonly cause: DamageCause,
    public readonly amount: number
  ) {
    super('livingDamage', true)
  }
}

declare module '../../event/events' {
  export interface CVMainEventMap {
    livingDamage: LivingDamageEvent
  }
}
