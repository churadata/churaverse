import type { LivingEntity } from '../../domain/model/livingEntity'
import type { IMainScene } from '../../scene/IScene/IMainScene'
import { CVEvent } from '../cvEvent'

/**
 * LivingEntityが回復したときに発生するイベント
 */
export class LivingHealEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly target: LivingEntity,
    public readonly amount: number
  ) {
    super('livingHeal', true)
  }
}

declare module '../../event/events' {
  export interface CVMainEventMap {
    livingHeal: LivingHealEvent
  }
}
