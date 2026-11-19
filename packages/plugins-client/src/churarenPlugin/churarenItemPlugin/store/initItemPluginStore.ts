import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IItemRenderer } from '../domain/IItemRenderer'
import type { IItemRendererFactory } from '../domain/IItemRendererFactory'
import { ItemRepository } from '../repository/itemRepository'
import type { ItemPluginStore } from './defItemPluginStore'

export function initItemPluginStore(store: Store<IMainScene>, rendererFactory: IItemRendererFactory | undefined): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const itemPluginStore: ItemPluginStore = {
    items: new ItemRepository(),
    itemRenderers: new Map<string, IItemRenderer>(),
    itemRendererFactory: rendererFactory,
  }

  store.setInit('churarenItemPlugin', itemPluginStore)
}

export function resetItemPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenItemPlugin')
}
