import type { Scenes } from 'churaverse-engine-server'
import { NotExistsMsgClassError } from './errors/notExistsMsgClassError'
import type { IMessageConstructor } from './interface/IMessage'
import type { MessageType } from './message/messages'
import type { Dest } from './types/dest'

export class MessageRegistry<Scene extends Scenes> {
  private static instance: MessageRegistry<Scenes>

  public static getInstance(): MessageRegistry<Scenes> {
    if (MessageRegistry.instance !== undefined) {
      return MessageRegistry.instance
    }

    MessageRegistry.instance = new MessageRegistry()
    return MessageRegistry.instance
  }

  private constructor() {}

  private readonly messageClassMap = new Map<MessageType<Scene>, IMessageConstructor<Scene, MessageType<Scene>[any]>>()
  private readonly messageDestMap = new Map<MessageType<Scene>, Dest>()

  /**
   * Messageの送受信処理の初期化に必要な情報を登録する
   */
  public register<MsgType extends MessageType<Scene> & string>(
    type: MsgType,
    MsgClass: IMessageConstructor<Scene, MsgType>,
    dest: Dest
  ): void {
    this.messageClassMap.set(type, MsgClass)
    this.messageDestMap.set(type, dest)
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

  /**
   * register()で登録したdestを返す
   */
  public getDest(type: MessageType<Scene>): Dest {
    const dest = this.messageDestMap.get(type)
    if (dest === undefined) throw Error(`message type: ${type as string}のDestが設定されていません`)

    return dest
  }
}
