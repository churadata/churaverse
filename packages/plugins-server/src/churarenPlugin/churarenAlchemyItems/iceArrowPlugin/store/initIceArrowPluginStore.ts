import type { IMainScene, Store } from 'churaverse-engine-server'
import { IceArrowRepository } from '../repository/iceArrowRepository'
import type { IceArrowPluginStore } from './defIceArrowPluginStore'
import '@churaverse/map-plugin-server'

export function initIceArrowPluginStore(store: Store<IMainScene>): void {
  const iceArrowPluginStore: IceArrowPluginStore = {
    iceArrows: new IceArrowRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('iceArrowPlugin', iceArrowPluginStore)
}
