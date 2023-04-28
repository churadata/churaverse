import { Scene } from 'phaser'
import { Interactor } from '../../interactor/Interactor'
import { TextFieldObserver } from '../../textFieldObserver'
import { TextChatDialog } from './textChatDialog'
import { IChatInputRender } from '../../domain/IRender/IChatInputRender'

/**
 * チャット入力部分のHTMLのKey
 */
const CHAT_INPUT_TEXTURE_KEY = 'chatForm'

/**
 * チャット送信ボタン
 */
const CHAT_SEND_BUTTON = 'chat-send-button'

/**
 * テキスト入力部分
 */
const TEXT_FIELD = 'text-field'

/**
 * チャット入力部分のHTMLのパス
 */
const CHAT_INPUT_PATH = 'assets/chatinputform.html'

/**
 * チャット入力部分
 */
export class TextChatInput implements IChatInputRender {
  public playerId: string
  public interactor?: Interactor
  public scene: Scene
  private isFocused = false
  private readonly inputChatArea: Phaser.GameObjects.DOMElement
  private constructor(
    scene: Scene,
    playerId: string,
    chatDialog: TextChatDialog,
    textFieldObserver: TextFieldObserver
  ) {
    this.playerId = playerId
    this.scene = scene
    // チャット入力部分の定義
    this.inputChatArea = this.scene.add
      .dom(-300, 555)
      .createFromCache(CHAT_INPUT_TEXTURE_KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)
    const textField = this.inputChatArea?.getChildByID(TEXT_FIELD) as HTMLInputElement
    textField.addEventListener('click', (event) => {
      this.isFocused = true
      // このイベントが実行された際に親ノードのid=gameのonClick()が実行されないようにするため。
      event.stopPropagation()
    })
    textFieldObserver.addTargetTextField(textField)

    chatDialog.add(this.inputChatArea)

    // 送信ボタンが押された時、playerIdとmessageを受け渡している
    const sendButon = document.getElementById(CHAT_SEND_BUTTON)
    if (sendButon !== null) {
      sendButon.onclick = () => {
        if (textField.value !== '') {
          const message = textField.value
          this.interactor?.sendChat(this.playerId, message)
          textField.value = ''
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
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(CHAT_INPUT_TEXTURE_KEY)) {
        resolve()
      }
      // チャット入力部分の読み込み
      scene.load.html(CHAT_INPUT_TEXTURE_KEY, CHAT_INPUT_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new TextChatInput(scene, playerId, chatDialog, textFieldObserver)
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  // 入力フィールドのフォーカスを外す
  private blurInput(): void {
    document.getElementById(TEXT_FIELD)?.blur()
    this.isFocused = false
  }

  public getMessage(): string {
    const textField = this.inputChatArea?.getChildByID('text-field') as HTMLInputElement
    return textField.value
  }

  public clearMessage(): void {
    const textField = this.inputChatArea?.getChildByID('text-field') as HTMLInputElement
    textField.value = ''
  }
}
