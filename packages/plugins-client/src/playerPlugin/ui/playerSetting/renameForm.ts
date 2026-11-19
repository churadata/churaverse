import type { ISettingDialog } from '@churaverse/core-ui-plugin-client'
import { DomManager, type IEventBus, type IMainScene } from 'churaverse-engine-client'
import { PlayerNameChangeEvent } from '../../event/playerNameChangeEvent'
import { RenameFormComponent } from './components/RenameComponent'

/**
 * 名前入力フォーム内にあるテキストフィールド要素のname
 */
export const TEXT_FIELD_ID = 'name-field'

/**
 * 名前入力フォーム内にある決定ボタン要素のname
 */
export const SEND_BUTTON_ID = 'name-send-button'

/**
 * 名前入力フォーム内にある文字数カウント要素のid
 */
export const RENAME_COUNT_ID = 'rename-count'

/**
 * プレイヤー名の最大文字数
 */
const MAX_PLAYER_NAME_LENGTH = 15

/**
 * プレイヤー名変更欄
 */
export class RenameForm {
  private playerId: string

  public constructor(
    playerId: string,
    name: string,
    settingDialog: ISettingDialog,
    private readonly eventBus: IEventBus<IMainScene>
  ) {
    this.playerId = playerId

    const content = DomManager.jsxToDom(RenameFormComponent({ defaultName: name, maxLength: MAX_PLAYER_NAME_LENGTH }))
    settingDialog.addContent('playerSetting', content)

    const textField = this.setupTextField()
    this.setupSendButton(textField)
  }

  public static build(
    playerId: string,
    defaultName: string,
    settingDialog: ISettingDialog,
    eventBus: IEventBus<IMainScene>
  ): RenameForm {
    return new RenameForm(playerId, defaultName, settingDialog, eventBus)
  }

  private setupTextField(): HTMLInputElement {
    const textField = DomManager.getElementById<HTMLInputElement>(TEXT_FIELD_ID)
    const countEl = document.getElementById(RENAME_COUNT_ID)

    textField.oninput = () => {
      const count = textField.value.length
      if (countEl !== null) {
        countEl.textContent = `${count}/${MAX_PLAYER_NAME_LENGTH}`
      }
    }

    textField.dispatchEvent(new Event('input')) // 初期値に対してもインジケーターが正しく表示されるようにするため、inputイベントを発火させる

    return textField
  }

  /**
   * 決定ボタンを押下した時の挙動を設定する
   */
  private setupSendButton(textField: HTMLInputElement): void {
    const sendButton = DomManager.getElementById(SEND_BUTTON_ID)

    sendButton.onclick = () => {
      // 入力欄の文字列を取得
      const name = textField.value.trim()
      const errors = this.validate(name)

      if (errors.length > 0) {
        alert(errors.join('\n'))
        return
      }

      // プレイヤーの名前を変更する
      const changeNameEvent = new PlayerNameChangeEvent(this.playerId, name)
      this.eventBus.post(changeNameEvent)
    }
  }

  private validate(name: string): string[] {
    const errors: string[] = []

    //名前の長さがMAX_PLAYER_NAME_LENGTH文字以下かを判定（全角・半角問わず）
    if (name.length === 0 || name.length > MAX_PLAYER_NAME_LENGTH) {
      errors.push(`名前は1文字以上${MAX_PLAYER_NAME_LENGTH}文字以下で入力してください`)
    }

    //名前の途中で2つ以上の連続したスペースがあるかを判定
    if (/\s{2,}/.test(name)) {
      errors.push('名前に連続したスペースを含めないでください')
    }

    return errors
  }

  public updatePlayerId(playerId: string): void {
    this.playerId = playerId
  }
}
