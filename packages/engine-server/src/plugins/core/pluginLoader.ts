import { getChuraverseConfig } from '../../churaverseConfig'
import type { IEventBus } from '../../eventbus/IEventBus'
import type { BaseScene } from '../../scene/IScene/baseScene'
import type { Scenes } from '../../scene/types'
import type { Store } from '../../store/store'
import type { BasePlugin } from './basePlugin/basePlugin'

export class PluginLoader {
  public async loadPlugins<Scene extends Scenes>(
    scene: BaseScene,
    bus: IEventBus<Scene>,
    store: Store<Scene>
  ): Promise<void> {
    const plugins: Array<BasePlugin<Scene>> = []
    Object.entries(getChuraverseConfig().pluginConfig.plugins).forEach(([sceneName, pluginClassList]) => {
      if (sceneName === scene.sceneName) {
        pluginClassList.forEach((PluginClass) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          plugins.push(new PluginClass(store, bus))
        })
      }
    })

    await Promise.all([
      ...plugins.map(async (plugin) => {
        await plugin.loading()
      }),
    ])

    plugins.forEach((plugin) => {
      plugin.listenEvent()
    })
  }
}
