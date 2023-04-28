import { Scene } from 'phaser'
import { IChatBoardRender } from '../../domain/IRender/IChatBoardRender'
import { TextChat } from '../../domain/model/textChat'
import { Interactor } from '../../interactor/Interactor'
import { TextChatDialog } from './textChatDialog'

/**
 * チャット表示部分のHTMLのKey
 */

const CHAT_BOARD_TEXTURE_KEY = 'chatBoard'

/**
 * チャット表示部分のHTMLのパス
 */
const CHAT_BOARD_PATH = 'assets/chatboard.html'

/**
 * チャット表示部分
 */
export class TextChatBoard implements IChatBoardRender {
  public playerId: string
  public interactor?: Interactor
  private readonly chatContainer: HTMLElement
  private constructor(scene: Scene, playerId: string, chatDialog: TextChatDialog) {
    this.playerId = playerId
    // チャット表示部分の定義
    const chatBoard = scene.add.dom(-300, 0).createFromCache(CHAT_BOARD_TEXTURE_KEY).setOrigin(0, 0).setScrollFactor(0)
    const chatContainer = document.getElementById('chat-container')

    if (chatContainer == null) {
      throw new Error('id:chat-containerを持つelementが見つかりません。')
    } else {
      this.chatContainer = chatContainer
      chatDialog.add(chatBoard)
    }
  }

  public static async build(scene: Scene, playerId: string, chatDialog: TextChatDialog): Promise<TextChatBoard> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(CHAT_BOARD_TEXTURE_KEY)) {
        resolve()
      }
      // チャット表示部分の読み込み
      scene.load.html(CHAT_BOARD_TEXTURE_KEY, CHAT_BOARD_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new TextChatBoard(scene, playerId, chatDialog)
    })
  }

  /**
   * メッセージが追加されると自動でスクロールする
   */
  public scrollToBottom(): void {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight
  }

  /**
   * テキストチャットにメッセージを追加する
   * @param textChat 追加したい要素
   */
  public add(textChat: TextChat): void {
    const content = document.createElement('li')
    content.style.fontSize = '12px'
    content.style.listStyle = 'none'
    content.style.padding = '12px 15px'
    content.style.textAlign = 'left'
    content.style.color = '#333333'
    content.textContent = `${textChat.name ?? 'name'}:${textChat.message}`
    this.chatContainer.appendChild(content)
    this.scrollToBottom()
  }

  /**
   * 全メッセージの再描画
   * @param allChat 再描画する全メッセージリスト
   */

  public redraw(allChat: TextChat[]): void {
    // 全部削除
    while (this.chatContainer.firstChild != null) {
      this.chatContainer.removeChild(this.chatContainer.firstChild)
    }

    allChat.forEach((t) => this.add(t))
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
