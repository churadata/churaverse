import type { Scenes } from 'churaverse-engine-client'
import type { IMessageListener } from './interface/IMessageListener'
import type { BaseMessage } from './message/baseMessage'

/**
 * MessageReceiverが保持するlistenerの配列
 */
export type MessageListenerList<Msg extends BaseMessage<Scenes>> = Array<IMessageListener<Msg>>
