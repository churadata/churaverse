import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IIceArrowAttackRenderer } from '../domain/IIceArrowAttackRenderer'
import type { IIceArrowAttackRendererFactory } from '../domain/IIceArrowAttackRendererFactory'
import { IceArrowRepository } from '../repository/iceArrowRepository'
import type { IceArrowPluginStore } from './defIceArrowPluginStore'

export function initIceArrowPluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: IIceArrowAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const iceArrowPluginStore: IceArrowPluginStore = {
    iceArrows: new IceArrowRepository(),
    iceArrowAttackRenderers: new Map<string, IIceArrowAttackRenderer>(),
    iceArrowAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenIceArrowPlugin', iceArrowPluginStore)
}

export function resetIceArrowPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenIceArrowPlugin')
}
