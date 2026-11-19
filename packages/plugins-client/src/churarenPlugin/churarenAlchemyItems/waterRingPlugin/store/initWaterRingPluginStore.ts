import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IWaterRingAttackRenderer } from '../domain/IWaterRingAttackRenderer'
import type { IWaterRingAttackRendererFactory } from '../domain/IWaterRingAttackRendererFactory'
import { WaterRingRepository } from '../repository/waterRingRepository'
import type { WaterRingPluginStore } from './defWaterRingPluginStore'

export function initWaterRingPluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: IWaterRingAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const waterRingPluginStore: WaterRingPluginStore = {
    waterRings: new WaterRingRepository(),
    waterRingAttackRenderers: new Map<string, IWaterRingAttackRenderer>(),
    waterRingAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenWaterRingPlugin', waterRingPluginStore)
}

export function resetWaterRingPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenWaterRingPlugin')
}
