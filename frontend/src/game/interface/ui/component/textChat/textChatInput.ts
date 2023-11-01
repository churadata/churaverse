import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { TextFieldObserver } from '../../util/textFieldObserver'
import { TextChatDialog } from './textChatDialog'
import { IChatInputRender } from '../../../../domain/IRender/IChatInputRender'
import { DomManager } from '../../util/domManager'

/**
 * チャット送信ボタンのid
 */
export const TEXT_CHAT_SEND_BUTTON_ID = 'chat-send-button'

/**
 * テキスト入力部分のid
 */
export const TEXT_CHAT_INPUT_FIELD_ID = 'chat-text-field'

/**
 * チャット入力部分
 */
export class TextChatInput implements IChatInputRender {
  public interactor?: Interactor
  private isFocused = false
  private readonly inputField: HTMLInputElement
  public constructor(private readonly playerId: string, textFieldObserver: TextFieldObserver) {
    this.playerId = playerId
    // チャット入力部分の定義

    this.inputField = DomManager.getElementById<HTMLInputElement>(TEXT_CHAT_INPUT_FIELD_ID)
    this.inputField.addEventListener('click', (event) => {
      this.isFocused = true
      // このイベントが実行された際に親ノードのid=gameのonClick()が実行されないようにするため。
      event.stopPropagation()
    })
    textFieldObserver.addTargetTextField(this.inputField)

    // 送信ボタンが押された時、playerIdとmessageを受け渡している
    const sendButon = DomManager.getElementById(TEXT_CHAT_SEND_BUTTON_ID)
    if (sendButon !== null) {
      sendButon.onclick = () => {
        if (this.inputField.value !== '') {
          const message = this.inputField.value
          this.interactor?.sendChat(this.playerId, message)
          this.inputField.value = ''
        }
      }
    }

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

  public static async build(
    scene: Scene,
    playerId: string,
    chatDialog: TextChatDialog,
    textFieldObserver: TextFieldObserver
  ): Promise<TextChatInput> {
    return new TextChatInput(playerId, textFieldObserver)
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  // 入力フィールドのフォーカスを外す
  private blurInput(): void {
    this.inputField.blur()
    this.isFocused = false
  }

  public getMessage(): string {
    return this.inputField.value
  }

  public clearMessage(): void {
    this.inputField.value = ''
  }
}
