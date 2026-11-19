import type { Scenes } from 'churaverse-engine-server'
import type { BaseMessage } from '../message/baseMessage'
import type { MessageType } from '../message/messages'
import type { Packet, SendMessage } from '../socket/packet'

// 送信キューをプレイヤー毎に分ける
export type TransmitQueueBuffers<Scene extends Scenes> = Map<string, Packet<Scene>>

/**
 * 送信するパケットを格納する.
 * メインループのループ毎に受信キューから取り出されたデータが送信キューに格納される.
 * 格納されるデータはプレイヤー毎に分けられ、キュー内のデータが各プレイヤーにそれぞれemitされる
 */
// eslint-disable-next-line import/export
export interface ITransmitQueue<Scene extends Scenes> {
  popPacket: () => Promise<TransmitQueueBuffers<Scene>> // 全送信キューから送信パケットをpop
  addQueue: (playerId: string) => void // 送信キューを追加
  removeQueue: (playerId: string) => void // 引数で指定した送信キューを削除
  getDestination: () => string[] // socketId(=playerId)一覧を取得

  // Messageを直接全プレイヤーの送信キューに追加（pushの場合は送信パケットを送信キューに追加）
  pushMessage: <Msg extends BaseMessage<Scene>>(message: Msg) => void
  pushMessageAt: <Msg extends BaseMessage<Scene>>(targetId: string, message: Msg) => void
  pushMessageWithout: <Msg extends BaseMessage<Scene>>(excludeId: string, message: Msg) => void

  hasPacket: () => boolean
}

// eslint-disable-next-line import/export
export interface ITransmitQueue<Scene extends Scenes> {
  pushSendMessage: (message: SendMessage<Scene, MessageType<Scene>>) => void
  pushSendMessageAt: (targetId: string, message: SendMessage<Scene, MessageType<Scene>>) => void
  pushSendMessageWithout: (excludeId: string, message: SendMessage<Scene, MessageType<Scene>>) => void
}
