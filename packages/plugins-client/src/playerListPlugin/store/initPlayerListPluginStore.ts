import type { IEventBus, IMainScene, Scenes, Store } from 'churaverse-engine-client'
import type { PlayerListUi } from '../playerListUi'
import type { PlayerListPluginStore } from './defPlayerListPluginStore'

export function initPlayerListPluginStore(
  _eventBus: IEventBus<Scenes>,
  store: Store<IMainScene>,
  playerListUi: PlayerListUi
): void {
  const pluginStore: PlayerListPluginStore = { playerListUi }
  store.setInit('playerListPlugin', pluginStore)
}
