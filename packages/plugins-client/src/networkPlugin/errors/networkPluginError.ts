import { CVError } from 'churaverse-engine-client'

export class NetworkPluginError extends CVError {
  static {
    NetworkPluginError.prototype.name = 'NetworkPluginError'
  }
}
