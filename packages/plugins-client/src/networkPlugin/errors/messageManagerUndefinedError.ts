import { NetworkPluginError } from './networkPluginError'

export class MessageManagerUndefinedError extends NetworkPluginError {
  static {
    MessageManagerUndefinedError.prototype.name = 'MessageManagerUndefinedError'
  }

  public constructor() {
    super('messageManager is undefined')
  }
}
