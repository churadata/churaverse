import { MapPluginError } from './mapPluginError'

export class NotExistsPropertyLayerError extends MapPluginError {
  public constructor(propertyName: string) {
    super(`${propertyName}もったlayerが存在しません`)
  }
}
