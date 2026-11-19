import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IBlackHoleAttackRenderer } from '../domain/IBlackHoleAttackRenderer'
import type { IBlackHoleAttackRendererFactory } from '../domain/IBlackHoleAttackRendererFactory'
import { BlackHoleRepository } from '../repository/blackHoleRepository'
import type { BlackHolePluginStore } from './defBlackHolePluginStore'

export function initBlackHolePluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: IBlackHoleAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const blackHolePluginStore: BlackHolePluginStore = {
    blackHoles: new BlackHoleRepository(),
    blackHoleAttackRenderers: new Map<string, IBlackHoleAttackRenderer>(),
    blackHoleAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenBlackHolePlugin', blackHolePluginStore)
}

export function resetBlackHolePluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenBlackHolePlugin')
}
