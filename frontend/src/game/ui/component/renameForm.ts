import { Scene } from 'phaser'
import { Interactor } from '../../interactor/Interactor'
import { TextFieldObserver } from '../../textFieldObserver'
import { SettingDialog } from './settingDialog'

/**
 * 名前入力フォームのHTMLのKey
 */
const NAME_FORM_KEY = 'nameform'

/**
 * 名前入力フォームのHTMLのパス
 */
const NAME_FORM_PATH = 'assets/nameform.html'

/**
 * 名前入力フォーム内にあるテキストフィールド要素のname
 */
const FIELD_NAME = 'name-field'

/**
 * 名前入力フォーム内にある決定ボタン要素のname
 */
const SEND_BUTTON_NAME = 'name-send-button'

/**
 * プレイヤー名変更欄
 */
export class RenameForm {
  private interactor?: Interactor
  private readonly playerId: string

  /**
   * 名前入力欄+決定ボタン
   */
  private readonly formElement: Phaser.GameObjects.DOMElement

  public constructor(
    scene: Scene,
    playerId: string,
    name: string,
    settingDialog: SettingDialog,
    textFieldObserver: TextFieldObserver
  ) {
    this.playerId = playerId

    // 入力フォームの定義
    this.formElement = scene.add.dom(-300, 0).createFromCache(NAME_FORM_KEY).setOrigin(0, 0).setScrollFactor(0)
    const textField = this.formElement.getChildByID(FIELD_NAME) as HTMLInputElement
    textField.value = name

    // 名前入力欄を監視対象に追加
    textFieldObserver.addTargetTextField(textField)

    this.setupSendButton()

    settingDialog.add(this.formElement)
  }

  public static async build(
    scene: Scene,
    playerId: string,
    name: string,
    settingDialog: SettingDialog,
    textFieldObserver: TextFieldObserver
  ): Promise<RenameForm> {
    return await new Promise<void>((resolve, reject) => {
      if (scene.textures.exists(NAME_FORM_KEY)) {
        resolve()
      }
      // 名前入力欄の読み込み
      scene.load.html(NAME_FORM_KEY, NAME_FORM_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new RenameForm(scene, playerId, name, settingDialog, textFieldObserver)
    })
  }

  /**
   * 決定ボタンを押下した時の挙動を設定する
   */
  private setupSendButton(): void {
    const send = this.formElement.getChildByID(SEND_BUTTON_NAME)
    if (send !== null) {
      send.addEventListener('pointerdown', () => {
        // 入力欄の文字列を取得
        const name = (this.formElement.getChildByID(FIELD_NAME) as HTMLInputElement).value
        if (name !== '') {
          // プレイヤーの名前を変更する
          this.interactor?.changePlayerName(this.playerId, name)
        }
      })
    }
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
