import type { IEventBus, Scenes } from 'churaverse-engine-client'
import type { MessageBuffer } from './buffer'
import type { SendData } from './interface/IMessage'
import type { BaseMessage } from './message/baseMessage'
import type { MessageType } from './message/messages'
import type { MessageReceiver } from './messageReceiver'
import type { MessageRegistry } from './messageRegistry'
import type { Packet, SendMessage } from './socket/packet'
import { Socket } from './socket/socket'
import type { SendableObject } from './types/sendable'

export class MessageManagerHelper<Scene extends Scenes> {
  private readonly socket: Socket<Scene>
  public constructor() {
    this.socket = Socket.build()
  }

  public sendPacket(
    senderId: string,
    messageBuffers: Map<MessageType<Scene>, MessageBuffer<BaseMessage<Scene>>>
  ): void {
    const myPacket: Packet<Scene> = []

    // messageType毎にbuffer内のdataをmessagesに追加
    for (const [messageType, buffer] of messageBuffers) {
      // 空のbufferはスキップ
      if (!buffer.hasMessage()) continue

      const sendMessage: SendMessage<Scene, typeof messageType> = {
        senderId,
        type: messageType as MessageType<Scene> & string,
        dataListOrCount: this.getDataListOrCount(buffer),
      }

      myPacket.push(sendMessage)
    }

    this.socket.emitPacket(myPacket)
  }

  /**
   * buffer内のdataを送信用に変換する.
   * 送信データが存在しないMessageの場合はbufferに蓄積されたMessageのlengthをdataにする
   * 送信データが存在するMessageの場合はそのままdataを取り出して配列として返す
   */
  private getDataListOrCount(buffer: MessageBuffer<BaseMessage<Scene>>): SendableObject[] | number {
    const bufferMsgs = buffer.popMessages()
    if (bufferMsgs[0].data === undefined) {
      // 送信データがない場合はMessage数をdataとする
      return bufferMsgs.length
    } else {
      return bufferMsgs.map((bufferMsg) => {
        // bufferMsgs[0].dataがundefinedでない場合それ以降の要素もundefinedではない
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return bufferMsg.data!
      })
    }
  }

  /**
   * パケット受信時の処理を登録する
   */
  public listenPacket(messageReceiver: MessageReceiver<Scene>, messageRegistry: MessageRegistry<Scene>): void {
    this.socket.listenPacket((packet) => {
      packet.forEach((sentMsg) => {
        messageReceiver.getListenerList(sentMsg.type).forEach((listener) => {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const MessageClass = messageRegistry.getMessageClass(sentMsg.type)
          if (typeof sentMsg.dataListOrCount === 'number') {
            for (let i = 0; i < sentMsg.dataListOrCount; i++) {
              listener(new MessageClass(undefined), sentMsg.senderId)
            }
          } else {
            sentMsg.dataListOrCount.forEach((data) => {
              listener(new MessageClass(data as SendData<Scene, typeof sentMsg.type>), sentMsg.senderId)
            })
          }
        })
      })
    })
  }

  public get socketId(): string {
    return this.socket.socketId
  }

  public get connected(): boolean {
    return this.socket.connected
  }

  public socketEventToBusEvent(eventBus: IEventBus<Scenes>): void {
    this.socket.socketEventToBusEvent(eventBus)
  }
}
