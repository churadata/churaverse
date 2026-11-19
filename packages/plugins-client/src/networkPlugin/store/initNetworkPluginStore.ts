import { type IMainScene, type Scenes, SceneUndefinedError, type Store } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import type { IMessageSender } from '../interface/IMessageSender'
import type { NetworkPluginStore } from './defNetworkPluginStore'

export function initNetworkPluginStore(
  store: Store<IMainScene>,
  scene: Scene | undefined,
  messageSender: IMessageSender<IMainScene>,
  socketId: string
): void {
  if (scene === undefined) throw new SceneUndefinedError()

  const pluginStore: NetworkPluginStore<Scenes> = {
    messageSender,
    socketId,
  }

  store.setInit('networkPlugin', pluginStore)
}
