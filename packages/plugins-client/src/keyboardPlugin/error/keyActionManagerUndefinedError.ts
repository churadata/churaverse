import { KeyboardPluginError } from './keyboardPluginError'

export class KeyActionManagerUndefinedError extends KeyboardPluginError {
  static {
    KeyActionManagerUndefinedError.prototype.name = 'KeyActionManagerUndefinedError'
  }

  public constructor() {
    super('keyActionManager is undefined')
  }
}
