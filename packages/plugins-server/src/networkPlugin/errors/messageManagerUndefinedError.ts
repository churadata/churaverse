import { NetworkPluginError } from './networkPluginError'

export class MessageManagerUndefinedError extends NetworkPluginError {
  public constructor() {
    super('messageManager is undefined')
  }
}
