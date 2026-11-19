import type { Scenes } from 'churaverse-engine-client'
import type { MessageType } from '../message/messages'
import { NetworkPluginError } from './networkPluginError'

export class NotExistsBufferError extends NetworkPluginError {
  static {
    NotExistsBufferError.prototype.name = 'NotExistsBufferError'
  }

  public constructor(type: MessageType<Scenes>) {
    super(`type: ${type}のMessageBufferが存在しない. registerMessage()を実行している必要がある`)
  }
}
