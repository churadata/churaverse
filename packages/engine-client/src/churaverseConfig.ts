import type { IPluginConfig } from './plugins/core/IPluginConfig'

const DEFAULT_SERVER_DOMAIN = 'localhost:8080'

export interface IChuraverseConfig {
  backendUrl: string
  backendLivekitUrl: string
  livekitUrl: string
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
  backendUrl: `http://${DEFAULT_SERVER_DOMAIN}/backend`,
  backendLivekitUrl: `http://${DEFAULT_SERVER_DOMAIN}/backend_livekit`,
  livekitUrl: `ws://${DEFAULT_SERVER_DOMAIN}/livekit`,
  pluginConfig: _pluginConfig,
}

export function defineChuraverseConfig(config: IChuraverseConfig): void {
  _churaverseConfig = config
}

export function getChuraverseConfig(): IChuraverseConfig {
  return _churaverseConfig
}
