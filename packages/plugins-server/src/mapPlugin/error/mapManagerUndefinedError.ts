import { MapPluginError } from './mapPluginError'

export class MapManagerUndefinedError extends MapPluginError {
  public constructor() {
    super('mapManager is undefined')
  }
}
