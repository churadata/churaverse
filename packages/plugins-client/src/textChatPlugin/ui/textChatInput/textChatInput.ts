import { DomManager, type IEventBus, type IMainScene, uniqueId } from 'churaverse-engine-client'
import { SendTextChatEvent } from '../../event/sendTextChatEvent'
import { TextChat } from '../../model/textChat'
import type { TextChatDialog } from '../textChatDialog/textChatDialog'
import { TEXT_CHAT_CHAR_COUNT_ID, TextChatInputComponent } from './components/TextChatInputComponent'
import type { IChatInputRenderer } from './IChatInputRenderer'

/**
 * チャット送信ボタンのid
 */
export const TEXT_CHAT_SEND_BUTTON_ID = 'chat-send-button'

/**
 * テキスト入力部分のid
 */
export const TEXT_CHAT_INPUT_FIELD_ID = 'chat-text-field'

export const TEXT_CHAT_MAX_LENGTH = 1000
const WARN_THRESHOLD = 50

/**
 * チャット入力部分
 */
export class TextChatInput implements IChatInputRenderer {
  private isFocused = false
  private readonly inputField: HTMLTextAreaElement
  private readonly charCountElement: HTMLElement
  private readonly sendButton: HTMLButtonElement

  public constructor(
    private readonly playerId: string,
    private readonly name: string,
    textChatDialog: TextChatDialog,
    private readonly eventBus: IEventBus<IMainScene>
  ) {
    textChatDialog.directlyAddContent(DomManager.addJsxDom(TextChatInputComponent()))
    this.playerId = playerId
    // チャット入力部分の定義
    this.inputField = DomManager.getElementById<HTMLTextAreaElement>(TEXT_CHAT_INPUT_FIELD_ID)
    this.charCountElement = DomManager.getElementById(TEXT_CHAT_CHAR_COUNT_ID)
    this.sendButton = DomManager.getElementById<HTMLButtonElement>(TEXT_CHAT_SEND_BUTTON_ID)

    this.inputField.addEventListener('click', (event) => {
      this.isFocused = true
      // このイベントが実行された際に親ノードのid=gameのonClick()が実行されないようにするため。
      event.stopPropagation()
    })

    this.inputField.addEventListener('input', () => {
      this.adjustInputHeight()
      this.updateCharCount()
      this.toggleSendButtonDisabled()
    })

    this.inputField.addEventListener('keydown', (event) => {
      if (event.isComposing) return

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.sendChatMessage()
      }
    })

    this.sendButton.onclick = this.sendChatMessage.bind(this)
    this.toggleSendButtonDisabled()

    // チャット外にFocusがあった時に、チャットのFocusを外れるようにしている
    const gameElement = document.getElementById('game')
    if (gameElement != null) {
      gameElement.onclick = () => {
        if (this.isFocused) {
          this.blurInput()
        }
      }
    }
  }

  private toggleSendButtonDisabled(): void {
    // 空白や改行のみの場合は送信不可（disabled = true）にする
    const message = this.inputField.value.trim()
    this.sendButton.disabled = message === ''
  }

  private adjustInputHeight(): void {
    this.inputField.style.height = 'auto' // 一旦autoにして正しい高さを再計算させる
    this.inputField.style.height = `${this.inputField.scrollHeight}px`
  }

  // 入力フィールドのフォーカスを外す
  private blurInput(): void {
    this.inputField.blur()
    this.isFocused = false
  }

  // 文字数カウンターの表示・非表示を制御する
  private updateCharCount(): void {
    // IME変換中はtextarea側のmaxLength属性が効かないブラウザがあるため、ここでも上限を強制する
    if (this.inputField.value.length > TEXT_CHAT_MAX_LENGTH) {
      this.inputField.value = this.inputField.value.substring(0, TEXT_CHAT_MAX_LENGTH)
    }

    const currentLength = this.inputField.value.length

    // 残り50文字以下になったら表示
    if (currentLength >= TEXT_CHAT_MAX_LENGTH - WARN_THRESHOLD) {
      this.charCountElement.innerText = `${currentLength}/${TEXT_CHAT_MAX_LENGTH}`
    } else {
      this.charCountElement.innerText = ''
    }
  }

  private sendChatMessage(): void {
    const message = this.inputField.value.trim()
    if (message === '') {
      return
    }

    this.inputField.value = ''
    this.adjustInputHeight()
    this.updateCharCount()
    this.toggleSendButtonDisabled()
    // 送信ボタンが押された時、playerIdとmessageを受け渡している
    const sendTextChatEvent = new SendTextChatEvent(new TextChat(uniqueId(), this.playerId, this.name, message))
    this.eventBus.post(sendTextChatEvent)
  }

  public getMessage(): string {
    return this.inputField.value
  }

  public clearMessage(): void {
    this.inputField.value = ''
    this.adjustInputHeight()
    this.updateCharCount()
    this.toggleSendButtonDisabled()
  }
}
