import type { IMainScene, Store } from 'churaverse-engine-client'
import type { ISharkRenderer } from '../domain/ISharkRenderer'
import type { ISharkRendererFactory } from '../domain/ISharkRendererFactory'
import { SharkRepository } from '../repository/sharkRepository'
import type { SharkPluginStore } from './defSharkPluginStore'

export function initSharkPluginStore(
  store: Store<IMainScene>,
  rendererFactory: ISharkRendererFactory | undefined
): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const sharkPluginStore: SharkPluginStore = {
    sharks: new SharkRepository(),
    sharkRenderers: new Map<string, ISharkRenderer>(),
    sharkRendererFactory: rendererFactory,
  }

  store.setInit('sharkPlugin', sharkPluginStore)
}
