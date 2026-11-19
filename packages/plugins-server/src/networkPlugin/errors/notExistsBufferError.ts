import type { Scenes } from 'churaverse-engine-server'
import type { MessageType } from '../message/messages'
import { NetworkPluginError } from './networkPluginError'

export class NotExistsBufferError extends NetworkPluginError {
  public constructor(type: MessageType<Scenes>) {
    super(`type: ${type}のMessageBufferが存在しない. registerMessage()を実行している必要がある`)
  }
}
