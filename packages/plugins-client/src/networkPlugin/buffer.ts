import type { Scenes } from 'churaverse-engine-client'
import type { BaseMessage } from './message/baseMessage'
import type { BufferType } from './types/bufferType'

/**
 * ActionHelperでデータをまとめておくるためのバッファ
 */
export class MessageBuffer<T extends BaseMessage<Scenes>> {
  private messages: T[] = []

  public constructor(private readonly bufferType: BufferType) {
    this.bufferType = bufferType
  }

  /**
   * Messageの追加
   * bufferTypeによって挙動が変わる
   * @param message
   */
  public addMessage(message: T): void {
    switch (this.bufferType) {
      case 'firstOnly':
        if (this.messages.length === 0) {
          this.messages = [message]
        }
        break
      case 'lastOnly':
        this.messages = [message]
        break
      case 'queue':
        this.messages.push(message)
        break
      case 'stack':
        this.messages.unshift(message)
        break
    }
  }

  /**
   * Messageを保持しているかの確認
   * @returns 1つ以上のMessageを保持しているか
   */
  public hasMessage(): boolean {
    return this.messages.length > 0
  }

  /**
   * 全Messageを返す. 保持していた全Messageはこのインスタンスから削除する
   */
  public popMessages(): T[] {
    // deep copyをreturn
    const msgs = [...this.messages]
    this.messages.length = 0
    return msgs
  }
}
