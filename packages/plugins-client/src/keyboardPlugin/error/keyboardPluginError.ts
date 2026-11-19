import { CVError } from 'churaverse-engine-client'

export class KeyboardPluginError extends CVError {
  static {
    KeyboardPluginError.prototype.name = 'KeyboardPluginError'
  }
}
