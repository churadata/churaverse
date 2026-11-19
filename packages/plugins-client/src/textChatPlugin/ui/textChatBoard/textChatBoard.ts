import { DomManager } from 'churaverse-engine-client'
import type { TextChat } from '../../model/textChat'
import type { IChatBoardRenderer } from '../interface/IChatBoardRenderer'
import type { TextChatDialog } from '../textChatDialog/textChatDialog'
import { TextChatBoardComponent } from './components/TextChatBoardComponent'
import { TextChatMessageBlockComponent } from './components/TextChatMessageBlockComponent'
import { TextChatUnreadDividerComponent } from './components/TextChatUnreadDividerComponent'

export const TEXT_CHAT_BOARD_CONTAINER_ID = 'text-chat-board'

/**
 * チャット表示部分
 */
export class TextChatBoard implements IChatBoardRenderer {
  private readonly chatBoardElement: HTMLElement
  private readonly messageElements = new Map<string, HTMLElement>()
  private unreadDividerElement: HTMLElement | null = null
  public constructor(
    private readonly playerId: string,
    textChatDialog: TextChatDialog
  ) {
    textChatDialog.directlyAddContent(DomManager.addJsxDom(TextChatBoardComponent()))
    this.chatBoardElement = DomManager.getElementById(TEXT_CHAT_BOARD_CONTAINER_ID)
  }

  // 指定したメッセージの直前に未読区切り線を表示し、見える位置までスクロールする
  public showUnreadDivider(firstUnreadId: string): void {
    this.removeUnreadDivider() // 既に存在していれば一旦消す

    const targetNode = this.messageElements.get(firstUnreadId)
    if (targetNode === undefined) return

    this.unreadDividerElement = DomManager.jsxToDom(TextChatUnreadDividerComponent())
    this.chatBoardElement.insertBefore(this.unreadDividerElement, targetNode)
    this.unreadDividerElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // 未読区切り線を削除する
  public removeUnreadDivider(): void {
    if (this.unreadDividerElement && this.unreadDividerElement.parentNode) {
      this.unreadDividerElement.parentNode.removeChild(this.unreadDividerElement)
    }
    this.unreadDividerElement = null
  }

  /**
   * メッセージが追加されると自動でスクロールする
   */
  public scrollToBottom(): void {
    this.chatBoardElement.scrollTop = this.chatBoardElement.scrollHeight
  }

  /**
   * テキストチャットにメッセージを追加する
   * @param textChat 追加したい要素
   */
  public add(textChat: TextChat, textColor: string = '#333333'): void {
    const messageElement = DomManager.jsxToDom(TextChatMessageBlockComponent({ textChat, textColor }))
    this.messageElements.set(textChat.id, messageElement)
    this.chatBoardElement.appendChild(messageElement)
    this.scrollToBottom()
  }

  /**
   * 全メッセージの再描画
   * @param allChat 再描画する全メッセージリスト
   */

  public redraw(allChat: TextChat[]): void {
    // 全部削除
    while (this.chatBoardElement.firstChild != null) {
      this.chatBoardElement.removeChild(this.chatBoardElement.firstChild)
    }
    this.unreadDividerElement = null
    this.messageElements.clear()

    allChat.forEach((t) => this.add(t))
  }
}
