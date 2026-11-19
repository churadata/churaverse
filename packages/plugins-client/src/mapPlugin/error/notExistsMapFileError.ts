import { MapPluginError } from './mapPluginError'

export class NotExistsMapFileError extends MapPluginError {
  public constructor(mapId: string) {
    super(`${mapId}のjsonファイルが存在しません`)
  }
}
