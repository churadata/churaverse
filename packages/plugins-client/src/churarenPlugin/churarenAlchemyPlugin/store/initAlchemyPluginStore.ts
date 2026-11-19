import type { IMainScene, Store } from 'churaverse-engine-client'
import { AlchemyItemManager } from '../alchemyItemManager'
import type { IAlchemyPotRenderer } from '../domain/IAlchemyPotRenderer'
import type { IAlchemyPotRendererFactory } from '../domain/IAlchemyPotRendererFactory'
import { AlchemyPotRepository } from '../repository/alchemyPotRepository'
import type { AlchemyPluginStore } from './defAlchemyPluginStore'

export function initAlchemyPluginStore(
  scene: Phaser.Scene,
  store: Store<IMainScene>,
  rendererFactory: IAlchemyPotRendererFactory | undefined
): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const alchemyPluginStore: AlchemyPluginStore = {
    alchemyPots: new AlchemyPotRepository(),
    alchemyPotRenderers: new Map<string, IAlchemyPotRenderer>(),
    alchemyPotRendererFactory: rendererFactory,
    alchemyItemManager: new AlchemyItemManager(scene),
  }

  store.setInit('alchemyPlugin', alchemyPluginStore)
}

export function resetAlchemyPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('alchemyPlugin')
}
