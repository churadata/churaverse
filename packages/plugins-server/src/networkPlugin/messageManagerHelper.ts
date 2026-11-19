import type http from 'node:http'
import { type IEventBus, logger, type Scenes } from 'churaverse-engine-server'
import type { SendData } from './interface/IMessage'
import type { IMessageListener } from './interface/IMessageListener'
import type { BaseMessage } from './message/baseMessage'
import type { MessageMap, MessageType } from './message/messages'
import type { MessageReceiver } from './messageReceiver'
import type { MessageRegistry } from './messageRegistry'
import type { IReceiveQueue } from './queue/IReceiveQueue'
import type { ITransmitQueue } from './queue/ITransmitQueue'
import type { SendMessage } from './socket/packet'
import { Socket } from './socket/socket'

export class MessageManagerHelper<Scene extends Scenes> {
  private readonly socket: Socket<Scene>
  public constructor(server: http.Server) {
    this.socket = Socket.build(server)
  }

  public pushMessageToTransmitQueue(
    message: BaseMessage<Scene>,
    senderId: string,
    transmitQueue: ITransmitQueue<Scene>,
    messageRegistry: MessageRegistry<Scene>
  ): void {
    const dest = messageRegistry.getDest(message.type)

    if (dest === 'allClients') {
      transmitQueue.pushMessage(message)
    } else if (dest === 'onlySelf') {
      transmitQueue.pushMessageAt(senderId, message)
    } else if (dest === 'others') {
      transmitQueue.pushMessageWithout(senderId, message)
    } else if (dest === 'onlyServer') {
      // onlyServerはclientに送信しないので送信キューにpushしない
    }
  }

  /**
   * Clientに送信キュー内のpacketを送信する
   */
  public async sendPacket(transmitQueue: ITransmitQueue<Scene>): Promise<void> {
    const transmitQueueBuffers = await transmitQueue.popPacket()
    transmitQueueBuffers.forEach((packet, playerId) => {
      this.socket.emitPacketTo(playerId, packet)
    })
  }

  /**
   * パケット受信時の処理を登録する
   */
  public listenPacket(receiveQueue: IReceiveQueue<Scene>): void {
    this.socket.listenPacket((packet) => {
      receiveQueue.pushPacket(packet)
    })
  }

  /**
   * 受信キュー内にあるデータを送信キューに移す. messageReceiver.on()で登録したlistenerの発火も行う
   */
  public transferReceiveQueueToTransmitQueue(
    receiveQueue: IReceiveQueue<Scene>,
    transmitQueue: ITransmitQueue<Scene>,
    messageReceiver: MessageReceiver<Scene>,
    messageRegistry: MessageRegistry<Scene>,
    isMessageSenderScene: boolean
  ): void {
    const packet = receiveQueue.popPacket()
    packet.forEach((sentMsg) => {
      logger.debug('sentMsg', sentMsg)
      messageReceiver.getListenerList(sentMsg.type).forEach((listener) => {
        this.execListener(listener, messageRegistry, sentMsg)
      })
      if (isMessageSenderScene) {
        this.pushSentMessageToTransmitQueue(transmitQueue, messageRegistry, sentMsg)
      }
    })
  }

  /**
   * messageReceiver.on()で登録したlistenerの発火
   */
  private execListener<SentMsg extends SendMessage<Scene, MessageType<Scene>>>(
    listener: IMessageListener<MessageMap<Scene>[MessageType<Scene> & string]>,
    messageRegistry: MessageRegistry<Scene>,
    sentMsg: SentMsg
  ): void {
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
  }

  /**
   * 引数のSentMsgをtransmitQueueに追加する
   */
  private pushSentMessageToTransmitQueue<SentMsg extends SendMessage<Scene, MessageType<Scene>>>(
    transmitQueue: ITransmitQueue<Scene>,
    messageRegistry: MessageRegistry<Scene>,
    sentMsg: SentMsg
  ): void {
    const dest = messageRegistry.getDest(sentMsg.type)

    if (dest === 'allClients') {
      transmitQueue.pushSendMessage(sentMsg)
    } else if (dest === 'onlySelf') {
      transmitQueue.pushSendMessageAt(sentMsg.senderId, sentMsg)
    } else if (dest === 'others') {
      transmitQueue.pushSendMessageWithout(sentMsg.senderId, sentMsg)
    } else if (dest === 'onlyServer') {
      // onlyServerはclientに送信しないので送信キューにpushしない
    }
  }

  public socketEventToBusEvent(eventBus: IEventBus<Scenes>): void {
    this.socket.socketEventToBusEvent(eventBus)
  }
}
