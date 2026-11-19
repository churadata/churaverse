import type { Scenes, Store } from 'churaverse-engine-server'
import type { IMessageSender } from '../interface/IMessageSender'
import type { NetworkPluginStore } from './defNetworkPluginStore'

export function initNetworkPluginStore(store: Store<Scenes>, messageSender: IMessageSender<Scenes>): void {
  const pluginStore: NetworkPluginStore<Scenes> = {
    messageSender,
  }

  store.setInit('networkPlugin', pluginStore)
}
