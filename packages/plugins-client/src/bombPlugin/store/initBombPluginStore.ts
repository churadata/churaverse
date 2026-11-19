import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IBombRenderer } from '../domain/IBombRenderer'
import type { IBombRendererFactory } from '../domain/IBombRendererFactory'
import { BombRepository } from '../repository/bombRepository'
import type { BombPluginStore } from './defBombPluginStore'

export function initBombPluginStore(store: Store<IMainScene>, rendererFactory: IBombRendererFactory | undefined): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const bombPluginStore: BombPluginStore = {
    bombs: new BombRepository(),
    bombRenderers: new Map<string, IBombRenderer>(),
    bombRendererFactory: rendererFactory,
  }

  store.setInit('bombPlugin', bombPluginStore)
}
