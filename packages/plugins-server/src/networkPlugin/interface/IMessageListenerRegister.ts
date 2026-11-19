import type { Scenes } from 'churaverse-engine-server'
import type { MessageMap, MessageType } from '../message/messages'
import type { IMessageListener } from './IMessageListener'

export interface IMessageListenerRegister<Scene extends Scenes> {
  /**
   * 受信時に実行するlistenerを登録する
   * @param type 受信するMessageのtype
   * @param listener 受信時に実行するcallback
   */
  on: <MsgType extends MessageType<Scene> & string>(
    type: MsgType,
    listener: IMessageListener<MessageMap<Scene>[MsgType]>
  ) => void

  /**
   * 受信時に実行するlistenerを解除する
   * @param type 受信するMessageのtype
   * @param listener 解除するcallback
   */
  off: <MsgType extends MessageType<Scene> & string>(
    type: MsgType,
    listener: IMessageListener<MessageMap<Scene>[MsgType]>
  ) => void
}
