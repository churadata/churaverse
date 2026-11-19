import { MapPluginError } from './mapPluginError'

export class MapChangeError extends MapPluginError {
  public constructor() {
    super('マップ変更中にエラーが発生しました')
  }
}
