import type { IMainScene, Store } from 'churaverse-engine-client'
import type { ITornadoAttackRenderer } from '../domain/ITornadoAttackRenderer'
import type { ITornadoAttackRendererFactory } from '../domain/ITornadoAttackRendererFactory'
import { TornadoRepository } from '../repository/tornadoRepository'
import type { TornadoPluginStore } from './defTornadoPluginStore'

export function initTornadoPluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: ITornadoAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const tornadoPluginStore: TornadoPluginStore = {
    tornados: new TornadoRepository(),
    tornadoAttackRenderers: new Map<string, ITornadoAttackRenderer>(),
    tornadoAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenTornadoPlugin', tornadoPluginStore)
}

export function resetTornadoPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenTornadoPlugin')
}
