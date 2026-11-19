import { DomManager, type IEventBus, type ITitleScene } from 'churaverse-engine-client'
import type { ITitleNameFieldRenderer } from '../../domain/ITitleNameFieldRenderer'
import { TitlePlayerNameChangeEvent } from '../../event/titlePlayerNameChangeEvent'
import { TitleNameFieldComponent } from '../components/TitleNameFieldComponent'

/**
 * 名前入力フォーム内にあるテキストフィールド要素のname
 */
const TITLE_FIELD_NAME = 'title-name-field'

/**
 * 名前入力フォーム内にある文字数カウント要素のid
 */
const TITLE_NAME_COUNT_ID = 'title-name-count'

/**
 * プレイヤー名の最大文字数
 */
const MAX_PLAYER_NAME_LENGTH = 15

export class TitleNameFieldRenderer implements ITitleNameFieldRenderer {
  /**
   * 名前入力欄
   */
  private readonly textField?: HTMLInputElement
  private readonly countText: HTMLElement | null

  public constructor(
    private readonly eventBus: IEventBus<ITitleScene>,
    initPlayerName: string
  ) {
    // 名前入力欄の生成
    DomManager.addJsxDom(TitleNameFieldComponent({ maxLength: MAX_PLAYER_NAME_LENGTH }))
    this.textField = DomManager.getElementById<HTMLInputElement>(TITLE_FIELD_NAME)
    this.countText = document.getElementById(TITLE_NAME_COUNT_ID)

    this.textField.value = initPlayerName
    // 入力時の動作
    this.textField.oninput = () => {
      const changeNameEvent = new TitlePlayerNameChangeEvent(this.getName())
      this.eventBus.post(changeNameEvent)
      this.updateCount()
    }
    // 初期値に対してもカウントを表示する
    this.updateCount()
  }

  private updateCount(): void {
    if (this.countText === null) return
    this.countText.textContent = `${this.getName().length}/${MAX_PLAYER_NAME_LENGTH}`
  }

  public getName(): string {
    return this.textField?.value ?? ''
  }

  public validate(): string[] {
    const name = this.getName()?.trim()
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
}
