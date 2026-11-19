import type { Scenes } from 'churaverse-engine-server'
import type { BaseMessage } from '../message/baseMessage'
import type { MessageType } from '../message/messages'
import type { Packet, SendMessage } from '../socket/packet'
import type { SendableObject } from '../types/sendable'
import type { ITransmitQueue, TransmitQueueBuffers } from './ITransmitQueue'

export class TransmitQueue<Scene extends Scenes> implements ITransmitQueue<Scene> {
  // 送信キューは受信キューとは違いプレイヤーの数だけ存在する
  private readonly packets: TransmitQueueBuffers<Scene> = new Map()

  private _hasPacket = false

  /**
   * 全プレイヤーの送信キューにMessageを追加
   */
  public pushMessage<Msg extends BaseMessage<Scene>>(message: Msg): void {
    for (const playerId of this.packets.keys()) {
      this.pushMessageAt(playerId, message)
    }
  }

  /**
   * 指定したプレイヤーの送信キューにMessageを追加
   */
  public pushMessageAt<Msg extends BaseMessage<Scene>>(playerId: string, message: Msg): void {
    const buf = this.packets.get(playerId)
    if (buf === undefined) return
    buf.push(this.messageToSendableMessage(playerId, message))
    this._hasPacket = true
  }

  private messageToSendableMessage(
    senderId: string,
    message: BaseMessage<Scene>
  ): SendMessage<Scene, MessageType<Scene>> {
    let dataListOrCount: number | SendableObject[] = 1
    if (message.data !== undefined) {
      dataListOrCount = [message.data]
    }

    const sendMsg: SendMessage<Scene, MessageType<Scene>> = {
      senderId,
      type: message.type,
      dataListOrCount,
    }
    return sendMsg
  }

  /**
   * 指定したプレイヤー以外の送信キューにMessageを追加
   */
  public pushMessageWithout<Msg extends BaseMessage<Scene>>(excludeId: string, message: Msg): void {
    for (const playerId of this.packets.keys()) {
      if (excludeId === playerId) continue
      this.pushMessageAt(playerId, message)
    }
  }

  /**
   * 全プレイヤーの送信キューにSendableなMessageオブジェクトを追加
   */
  public pushSendMessage(message: SendMessage<Scene, MessageType<Scene>>): void {
    for (const playerId of this.packets.keys()) {
      this.pushSendMessageAt(playerId, message)
    }
  }

  /**
   * 指定したプレイヤーの送信キューにSendableなMessageオブジェクトを追加
   */
  public pushSendMessageAt(playerId: string, message: SendMessage<Scene, MessageType<Scene>>): void {
    const buf = this.packets.get(playerId)
    if (buf === undefined) return
    buf.push(message)
    this._hasPacket = true
  }

  /**
   * 指定したプレイヤー以外の送信キューにSendableなMessageオブジェクトを追加
   */
  public pushSendMessageWithout(excludeId: string, message: SendMessage<Scene, MessageType<Scene>>): void {
    for (const playerId of this.packets.keys()) {
      if (excludeId === playerId) continue
      this.pushSendMessageAt(playerId, message)
    }
  }

  /**
   * 全プレイヤーの送信キュー内にある全パケットを取り出し、キューを空にする
   */
  public async popPacket(): Promise<TransmitQueueBuffers<Scene>> {
    const allPlayerTransmitQueue: TransmitQueueBuffers<Scene> = new Map()

    for (const playerId of this.packets.keys()) {
      allPlayerTransmitQueue.set(playerId, this.popPacketAt(playerId))
    }

    this._hasPacket = false
    return allPlayerTransmitQueue
  }

  /**
   * 指定したプレイヤーの送信キュー内にある全パケットを取り出し、キューを空にする
   */
  private popPacketAt(playerId: string): Packet<Scene> {
    // この方法ではシリアライズ可能なオブジェクトのみコピー可能
    // socket.ioで通信できるのもシリアライズ可能なオブジェクトのみなのでこの方法でdeep copyしている
    const packet = this.packets.get(playerId)
    const poppedPacket = packet !== undefined ? structuredClone(packet) : []
    // 中身を空に
    this.packets.set(playerId, [])
    return poppedPacket
  }

  // 新規プレイヤー追加時に送信キューを追加
  public addQueue(playerId: string): void {
    if (this.packets.has(playerId)) {
      return
    }
    this.packets.set(playerId, [])
  }

  // プレイヤー退出時に送信キューを削除
  public removeQueue(playerId: string): void {
    this.packets.delete(playerId)
  }

  public getDestination(): string[] {
    return Array.from(this.packets.keys())
  }

  public hasPacket(): boolean {
    return this._hasPacket
  }
}
