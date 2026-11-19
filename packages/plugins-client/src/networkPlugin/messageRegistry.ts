import type { Scenes } from 'churaverse-engine-client'
import { MessageBuffer } from './buffer'
import { NotExistsMsgClassError } from './errors/notExistsMsgClassError'
import type { IMessageConstructor } from './interface/IMessage'
import type { MessageType } from './message/messages'
import type { BufferType } from './types/bufferType'

export class MessageRegistry<Scene extends Scenes> {
  private readonly messageClassMap = new Map<MessageType<Scene>, IMessageConstructor<Scene, MessageType<Scene>[any]>>()

  /**
   * Messageの送受信処理の初期化に必要な情報を登録する
   */
  public register<MsgType extends MessageType<Scene> & string>(
    type: MsgType,
    MsgClass: IMessageConstructor<Scene, MsgType>,
    bufferType: BufferType,
    buffers: Map<MessageType<Scene>, MessageBuffer<any>>
  ): void {
    if (bufferType !== 'noBuffer') {
      buffers.set(type, new MessageBuffer(bufferType))
    }

    this.messageClassMap.set(type, MsgClass)
  }

  /**
   * register()で登録したクラスを返す
   */
  public getMessageClass<MsgType extends MessageType<Scene> & string>(
    type: MsgType
  ): IMessageConstructor<Scene, MsgType> {
    const msgClass = this.messageClassMap.get(type)
    if (msgClass === undefined) throw new NotExistsMsgClassError<Scene>(type)
    return msgClass
  }
}
