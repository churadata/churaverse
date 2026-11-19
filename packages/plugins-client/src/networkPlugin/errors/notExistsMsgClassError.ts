import type { Scenes } from 'churaverse-engine-client'
import type { MessageType } from '../message/messages'
import { NetworkPluginError } from './networkPluginError'

export class NotExistsMsgClassError<Scene extends Scenes> extends NetworkPluginError {
  static {
    NotExistsMsgClassError.prototype.name = 'NotExistsMsgClassError'
  }

  public constructor(type: MessageType<Scene> & string) {
    super(`type: ${type}のMessageClassが存在しない. registerMessage()を実行している必要がある`)
  }
}
