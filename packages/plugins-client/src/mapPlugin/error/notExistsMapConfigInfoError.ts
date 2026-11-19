import { MapPluginError } from './mapPluginError'

export class NotExistsMapConfigInfoError extends MapPluginError {
  public constructor(mapId: string) {
    super(`${mapId}はMapConfigに存在しません`)
  }
}
