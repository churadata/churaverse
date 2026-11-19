import type { Scenes } from 'churaverse-engine-server'
import type { MessageMap, MessageType } from '../message/messages'

/**
 * Messageをインスタンス化して返す関数
 */
export type IMessageBuilder<Scene extends Scenes, MsgType extends MessageType<Scene> & string> = (
  data: MessageMap<Scene>[MsgType]['data']
) => MessageMap<Scene>[MsgType]
