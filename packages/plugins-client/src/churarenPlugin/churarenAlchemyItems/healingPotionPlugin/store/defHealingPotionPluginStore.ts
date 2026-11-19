import type { HealingPotionRepository } from '../repository/healingPotionRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenHealingPotionPlugin: HealingPotionPluginStore
  }
}

export interface HealingPotionPluginStore {
  readonly healingPotions: HealingPotionRepository
}
