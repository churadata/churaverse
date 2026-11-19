import type { Scenes } from 'churaverse-engine-client'
import type { MessageMap, MessageType } from '../message/messages'

export interface IMessageSender<Scene extends Scenes> {
  /**
   * Messageを送信する
   */
  send: <MsgType extends MessageType<Scene> & string>(message: MessageMap<Scene>[MsgType]) => void
}
