import type { DamageCause } from '../../domain/model/damageCause'
import type { LivingEntity } from '../../domain/model/livingEntity'
import type { IMainScene } from '../../scene/IScene/IMainScene'
import { CVEvent } from '../cvEvent'

/**
 * LivingEntityがダメージを受けたときに発生するイベント
 */
export class LivingDamageEvent extends CVEvent<IMainScene> {
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
