import type { IPluginConfig } from './plugins/core/IPluginConfig'

export interface IChuraverseConfig {
  pluginConfig: IPluginConfig
}

// defineChuraverseConfigでConfigを設定しなかった場合のデフォルト値
export const _pluginConfig: IPluginConfig = {
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MainScene: [],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    TitleScene: [],
  },
}

// defineChuraverseConfigでConfigを設定しなかった場合のデフォルト値
export let _churaverseConfig: IChuraverseConfig = {
  pluginConfig: _pluginConfig,
}

export function defineChuraverseConfig(config: IChuraverseConfig): void {
  _churaverseConfig = config
}

export function getChuraverseConfig(): IChuraverseConfig {
  return _churaverseConfig
}
