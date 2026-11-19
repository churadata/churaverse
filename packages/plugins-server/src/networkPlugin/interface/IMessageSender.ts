import type { Scenes } from 'churaverse-engine-server'
import type { BaseMessage } from '../message/baseMessage'

export interface IMessageSender<Scene extends Scenes> {
  /**
   * Messageを送信する
   */
  send: (message: BaseMessage<Scene>, senderId?: string) => void
}
