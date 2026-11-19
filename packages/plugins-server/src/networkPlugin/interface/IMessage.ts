import type { Scenes } from 'churaverse-engine-server'
import type { MessageMap, MessageType } from '../message/messages'

/**
 * Messageのconstructorがdataのみを受け取るように制限する
 */
export type IMessageConstructor<Scene extends Scenes, MsgType extends MessageType<Scene> & string> = new (
  data: SendData<Scene, MsgType>
) => MessageMap<Scene>[MsgType]

export type SendData<
  Scene extends Scenes,
  MsgType extends MessageType<Scene> & string,
> = MessageMap<Scene>[MsgType]['data'] extends undefined ? undefined : MessageMap<Scene>[MsgType]['data']
