import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { DomInputObserver } from '../../util/domInputObserver'
import { SettingDialog } from './settingDialog'
import { RenameFormComponent } from './components/RenameComponent'
import { DomManager } from '../../util/domManager'
import { SettingSection } from './settingSection'

/**
 * 名前入力フォーム内にあるテキストフィールド要素のname
 */
export const TEXT_FIELD_ID = 'name-field'

/**
 * 名前入力フォーム内にある決定ボタン要素のname
 */
export const SEND_BUTTON_ID = 'name-send-button'

/**
 * プレイヤー名変更欄
 */
export class RenameForm {
  private interactor?: Interactor
  private readonly playerId: string

  public constructor(
    scene: Scene,
    playerId: string,
    name: string,
    settingDialog: SettingDialog,
    domInputObserver: DomInputObserver
  ) {
    this.playerId = playerId

    const content = DomManager.jsxToDom(RenameFormComponent({ defaultName: name }))
    settingDialog.addSection(new SettingSection('renameForm', 'プレイヤー名'))
    settingDialog.addContent('renameForm', content)

    const textField = this.setupTextField(domInputObserver)
    this.setupSendButton(textField)
  }

  public static async build(
    scene: Scene,
    playerId: string,
    defaultName: string,
    settingDialog: SettingDialog,
    domInputObserver: DomInputObserver
  ): Promise<RenameForm> {
    return new RenameForm(scene, playerId, defaultName, settingDialog, domInputObserver)
  }

  private setupTextField(domInputObserver: DomInputObserver): HTMLInputElement {
    const textField = DomManager.getElementById<HTMLInputElement>(TEXT_FIELD_ID)

    // 名前入力欄を監視対象に追加
    domInputObserver.addTargetDom(textField)

    return textField
  }

  /**
   * 決定ボタンを押下した時の挙動を設定する
   */
  private setupSendButton(textField: HTMLInputElement): void {
    const sendButton = DomManager.getElementById(SEND_BUTTON_ID)

    sendButton.onclick = () => {
      // 入力欄の文字列を取得
      const name = textField.value
      if (name !== '') {
        // プレイヤーの名前を変更する
        this.interactor?.changePlayerName(this.playerId, name)
      }
    }
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}

declare module './settingDialog' {
  export interface SettingDialogSectionMap {
    renameForm: SettingSection
  }
}
