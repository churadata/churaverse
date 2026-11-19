import type { IMainScene, Store } from 'churaverse-engine-client'
import { HealingPotionRepository } from '../repository/healingPotionRepository'
import type { HealingPotionPluginStore } from './defHealingPotionPluginStore'

export function initHealingPotionPluginStore(store: Store<IMainScene>): void {
  const healingPotionPluginStore: HealingPotionPluginStore = {
    healingPotions: new HealingPotionRepository(),
  }

  store.setInit('churarenHealingPotionPlugin', healingPotionPluginStore)
}

export function resetHealingPotionPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenHealingPotionPlugin')
}
