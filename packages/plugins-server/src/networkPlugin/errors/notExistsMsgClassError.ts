import type { Scenes } from 'churaverse-engine-server'
import type { MessageType } from '../message/messages'
import { NetworkPluginError } from './networkPluginError'

export class NotExistsMsgClassError<Scene extends Scenes> extends NetworkPluginError {
  public constructor(type: MessageType<Scene>) {
    super(`type: ${type as string}のMessageClassが存在しない. registerMessage()を実行している必要がある`)
  }
}
