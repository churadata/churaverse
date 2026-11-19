import type http from 'node:http'
import type { IEventBus, Scenes } from 'churaverse-engine-server'
import type { IMessageConstructor } from './interface/IMessage'
import type { IMessageListener } from './interface/IMessageListener'
import type { IMessageListenerRegister } from './interface/IMessageListenerRegister'
import type { IMessageRegister } from './interface/IMessageRegister'
import type { IMessageSender } from './interface/IMessageSender'
import type { BaseMessage } from './message/baseMessage'
import type { MessageMap, MessageType } from './message/messages'
import { MessageManagerHelper } from './messageManagerHelper'
import { MessageReceiver } from './messageReceiver'
import { MessageRegistry } from './messageRegistry'
import type { IReceiveQueue } from './queue/IReceiveQueue'
import type { ITransmitQueue } from './queue/ITransmitQueue'
import { ReceiveQueue } from './queue/receiveQueue'
import { TransmitQueue } from './queue/transmitQueue'
import type { Dest } from './types/dest'

export class MessageManager<Scene extends Scenes>
  implements IMessageRegister<Scene>, IMessageListenerRegister<Scene>, IMessageSender<Scene>
{
  private readonly messageReceiver: MessageReceiver<Scene>
  private readonly messageRegistry: MessageRegistry<Scene>
  private readonly receiveQueue: IReceiveQueue<Scene>
  private readonly transmitQueue: ITransmitQueue<Scene>
  private readonly messageManagerHelper: MessageManagerHelper<Scene>

  public constructor(
    server: http.Server,
    private readonly isMessageSenderScene: boolean
  ) {
    this.messageReceiver = new MessageReceiver()
    this.messageRegistry = MessageRegistry.getInstance()
    this.receiveQueue = new ReceiveQueue()
    this.transmitQueue = new TransmitQueue()
    this.messageManagerHelper = new MessageManagerHelper(server)

    this.messageManagerHelper.listenPacket(this.receiveQueue)
  }

  public registerMessage<MsgType extends MessageType<Scene> & string>(
    type: MsgType,
    MsgClass: IMessageConstructor<Scene, MsgType>,
    dest: Dest
  ): void {
    this.messageRegistry.register(type, MsgClass, dest)
  }

  public on<MsgType extends MessageType<Scene> & string>(
    type: MsgType,
    listener: IMessageListener<MessageMap<Scene>[MsgType]>
  ): void {
    this.messageReceiver.on(type, listener)
  }

  public off<MsgType extends MessageType<Scene> & string>(
    type: MsgType,
    listener: IMessageListener<MessageMap<Scene>[MsgType]>
  ): void {
    this.messageReceiver.off(type, listener)
  }

  public send(message: BaseMessage<Scene>, senderId: string = 'server'): void {
    this.messageManagerHelper.pushMessageToTransmitQueue(message, senderId, this.transmitQueue, this.messageRegistry)
  }

  /**
   * 送信キュー内のパケットをClientに送信する
   */
  public sendPacket(): void {
    void this.messageManagerHelper.sendPacket(this.transmitQueue)
  }

  /**
   * パケットを送信する必要がある場合Trueを返す
   */
  public shouldSendPacket(): boolean {
    return this.transmitQueue.hasPacket()
  }

  public addQueue(playerId: string): void {
    this.transmitQueue.addQueue(playerId)
  }

  public removeQueue(playerId: string): void {
    this.transmitQueue.removeQueue(playerId)
  }

  public socketEventToBusEvent(eventBus: IEventBus<Scenes>): void {
    this.messageManagerHelper.socketEventToBusEvent(eventBus)
  }

  public update(): void {
    if (this.receiveQueue.hasPacket()) {
      this.messageManagerHelper.transferReceiveQueueToTransmitQueue(
        this.receiveQueue,
        this.transmitQueue,
        this.messageReceiver,
        this.messageRegistry,
        this.isMessageSenderScene
      )
    }
  }
}
