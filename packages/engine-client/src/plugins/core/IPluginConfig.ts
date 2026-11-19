import type { SceneMap, SceneName } from '../../scene/types'
import type { BasePlugin } from './basePlugin/basePlugin'

export interface IPluginConfig {
  plugins: {
    [key in SceneName]: Array<typeof BasePlugin<SceneMap[key]>>
  }
  options?: IPluginConfigOptions
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPluginConfigOptions {}
