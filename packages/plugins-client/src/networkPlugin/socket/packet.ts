import type { Scenes } from 'churaverse-engine-client'
import type { MessageType } from '../message/messages'
import type { SendableObject } from '../types/sendable'

/**
 * socket.ioで実際に送受信されるデータ
 */
export type Packet<Scene extends Scenes> = Array<SendMessage<Scene, MessageType<Scene>>>

export interface SendMessage<Scene extends Scenes, MsgType extends MessageType<Scene>> extends SendableObject {
  senderId: string
  type: MsgType & string
  /**
   * messageのdataの配列. 送信データがないmessageの場合はemit回数
   */
  dataListOrCount: SendableObject[] | number
}
