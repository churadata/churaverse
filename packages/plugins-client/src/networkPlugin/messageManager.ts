import type { IEventBus, Scenes } from 'churaverse-engine-client'
import type { MessageBuffer } from './buffer'
import { NotExistsBufferError } from './errors/notExistsBufferError'
import type { IMessageConstructor } from './interface/IMessage'
import type { IMessageListener } from './interface/IMessageListener'
import type { IMessageListenerRegister } from './interface/IMessageListenerRegister'
import type { IMessageRegister } from './interface/IMessageRegister'
import type { IMessageSender } from './interface/IMessageSender'
import type { MessageMap, MessageType } from './message/messages'
import { MessageManagerHelper } from './messageManagerHelper'
import { MessageReceiver } from './messageReceiver'
import { MessageRegistry } from './messageRegistry'
import type { BufferType } from './types/bufferType'

export class MessageManager<Scene extends Scenes>
  implements IMessageRegister<Scene>, IMessageListenerRegister<Scene>, IMessageSender<Scene>
{
  private readonly messageReceiver: MessageReceiver<Scene>
  private readonly messageRegistry: MessageRegistry<Scene>
  private readonly messageBuffers: Map<MessageType<Scene>, MessageBuffer<any>>
  private readonly messageManagerHelper: MessageManagerHelper<Scene>

  /**
   * 中身の入ったbufferが1つ以上存在する場合はtrue
   */
  private anyBufferHasData = false

  /**
   * 最後にsendした瞬間の時間
   */
  private lastSendTime = Date.now()

  public constructor(
    /**
     * パケット化する時間幅(ms).
     * 最初にbufferに格納されてからpacketIntervalだけ待機し, その間にbufferに追加されたデータをまとめて送信する
     */
    private readonly sendIntervalMs = 100
  ) {
    this.messageBuffers = new Map()
    this.messageReceiver = new MessageReceiver()
    this.messageRegistry = new MessageRegistry()
    this.messageManagerHelper = new MessageManagerHelper()

    this.messageManagerHelper.listenPacket(this.messageReceiver, this.messageRegistry)
  }

  public registerMessage<MsgType extends MessageType<Scene> & string>(
    type: MsgType,
    MsgClass: IMessageConstructor<Scene, MsgType>,
    bufferType: BufferType
  ): void {
    this.messageRegistry.register(type, MsgClass, bufferType, this.messageBuffers)
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

  public send<MsgType extends MessageType<Scene> & string>(message: MessageMap<Scene>[MsgType]): void {
    // 実際の処理ではすぐに送信はせずにbufferに追加, 一定時間経過後にパケット化されて送信
    // ただし前回send時から時間がthis.sendIntervalMs以上経過している場合は即送信する
    const buffer = this.messageBuffers.get(message.type as MsgType)
    if (buffer === undefined) throw new NotExistsBufferError(message.type)
    buffer.addMessage(message)
    this.anyBufferHasData = true

    if (this.shouldSendPacket()) {
      this.sendPacket()
    }
  }

  /**
   * 全てのbufferのMessageをパケット化してサーバーに送信する
   */
  public sendPacket(): void {
    this.messageManagerHelper.sendPacket(this.socketId, this.messageBuffers)
    this.lastSendTime = Date.now()
    this.anyBufferHasData = false
  }

  /**
   * bufferに溜まっている未送信のMessageを全て破棄する.
   * 切断中は送信されずbufferに溜まり続けるが, その中身は切断前(または空)のsocketIdで作られた古い状態のため,
   * 再接続時にそのまま送信するとサーバーに持ち主のいないプレイヤーが作られてしまう
   */
  public clearBuffers(): void {
    for (const buffer of this.messageBuffers.values()) {
      buffer.popMessages()
    }
    this.anyBufferHasData = false
  }

  /**
   * パケットを送信する必要がある場合Trueを返す
   */
  public shouldSendPacket(now: number = Date.now()): boolean {
    return this.anyBufferHasData && this.isTimeExceedingLastSendPacket(now) && this.messageManagerHelper.connected
  }

  /**
   * 時間が最後のパケット送信時からthis.sendIntervalMsより経過したか
   * @param now 現在時刻(ms)
   * @returns 超過したかどうか
   */
  public isTimeExceedingLastSendPacket(now: number = Date.now()): boolean {
    return now - this.lastSendTime > this.sendIntervalMs
  }

  public get socketId(): string {
    return this.messageManagerHelper.socketId
  }

  public socketEventToBusEvent(bus: IEventBus<Scenes>): void {
    this.messageManagerHelper.socketEventToBusEvent(bus)
  }
}
