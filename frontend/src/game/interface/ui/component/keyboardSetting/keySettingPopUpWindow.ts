import { Scene } from 'phaser'
import { IKeyboardSettingPopUpWindow } from '../../../../domain/IRender/IKeySettingPopUpWindow'
import { Interactor } from '../../../../interactor/Interactor'
import { KeyboardHelper } from '../../../keyboard/keyboardHelper'
import { DomInputObserver } from '../../util/domInputObserver'
import { KeyCode, KeyEvent } from '../../../../domain/model/core/types'
import { DomManager } from '../../util/domManager'
import { KeySettingPopupWindowComponent } from './components/KeySettingPopupWindowComponent'
import { domLayerSetting } from '../../util/domLayer'
import { makeLayerHigherTemporary } from '../../util/makeLayerHigherTemporary'

/**
 * キー設定を保存してウィンドウを閉じるボタンのid
 */
export const KEY_SETTING_SAVE_BUTTON_ID = 'key-setting-save'

/**
 * キー設定を保存せずウィンドウを閉じるボタンのid
 */
export const KEY_SETTING_CANCEL_BUTTON_ID = 'key-setting-cancel'

/**
 * キーイベントとキー入力用inputのペアをまとめた要素のid
 */
export const KEY_SETTING_TABLE_ROW_ID: (keyEvent: KeyEvent) => string = (keyEvent: KeyEvent) => {
  return `key-setting-table-row-${keyEvent}`
}

export class KeyboardSettingPopUpWindow implements IKeyboardSettingPopUpWindow {
  private interactor?: Interactor
  /**
   * 変更するキーの入力を保存する配列
   */
  private readonly willBindingKeys: Map<KeyEvent, KeyCode>

  /**
   * 変更前のキーを保存する配列
   */
  private readonly currentBindingKeys: Map<KeyEvent, KeyCode>

  private readonly popUpWindow: HTMLElement

  private constructor(
    private readonly scene: Scene,
    private readonly keyboardHelper: KeyboardHelper,
    initKeyPreference: Map<KeyEvent, KeyCode>,
    domInputObserver: DomInputObserver
  ) {
    // deep copy
    this.willBindingKeys = new Map(initKeyPreference)
    this.currentBindingKeys = new Map(initKeyPreference)

    this.popUpWindow = DomManager.addJsxDom(
      KeySettingPopupWindowComponent({
        eventAndKeyCode: new Map(initKeyPreference),
      })
    )

    domLayerSetting(this.popUpWindow, 'higher')
    this.popUpWindow.addEventListener('mousedown', () => {
      makeLayerHigherTemporary(this.popUpWindow, 'higher')
    })
    this.setupAllKeyInput(domInputObserver)
    this.setupCancelButton()
    this.setupSaveButton()

    this.closePopupWindow()
  }

  public static async build(
    scene: Scene,
    keyboardHelper: KeyboardHelper,
    initKeyPreference: Map<KeyEvent, KeyCode>,
    domInputObserver: DomInputObserver
  ): Promise<KeyboardSettingPopUpWindow> {
    return new KeyboardSettingPopUpWindow(scene, keyboardHelper, initKeyPreference, domInputObserver)
  }

  /**
   * キーバインド設定ウィンドウを閉じる
   */
  private closePopUpWindowButton(): void {
    this.interactor?.closeKeySettingPopUPWindow()
  }

  /**
   * キー設定用のinputに入力した時の挙動を設定する
   */
  private setupAllKeyInput(domInputObserver: DomInputObserver): void {
    this.currentBindingKeys.forEach((keyCode, keyEvent) => {
      this.setupInput(keyEvent, keyCode, domInputObserver)
    })
  }

  /**
   * 引数で指定したキーイベント用のinputの初期設定を行う
   */
  private setupInput(eventName: KeyEvent, key: KeyCode, domInputObserver: DomInputObserver): HTMLInputElement {
    const row = DomManager.getElementById<HTMLTableRowElement>(KEY_SETTING_TABLE_ROW_ID(eventName))

    const input = row.cells[1].children[0]
    if (!(input instanceof HTMLInputElement))
      throw Error(`id=${KEY_SETTING_TABLE_ROW_ID(eventName)}の要素はHTMLInputElementではない`)

    domInputObserver.addTargetDom(input)
    input.value = key
    // input欄にキー入力をそのまま表示させないように制御してます
    input.setAttribute('readonly', 'readonly')

    // 押されたキーのキーコードを習得
    input.addEventListener('keydown', (event) => {
      const key = event.key.replace(/Arrow/g, '').toUpperCase()
      input.value = key
      this.willBindingKeys.set(eventName, key as KeyCode)
    })
    return input
  }

  /**
   * キャンセルボタンを押した時の挙動を設定する
   */
  private setupCancelButton(): void {
    const cancelButton = DomManager.getElementById(KEY_SETTING_CANCEL_BUTTON_ID)
    cancelButton.onclick = () => {
      this.closePopUpWindowButton()
      // 保存取り消し＆表示の切り替え処理
      this.cancelChanges()
    }
  }

  /**
   * 保存ボタンを押した時の挙動を設定する
   */
  private setupSaveButton(): void {
    const saveButton = DomManager.getElementById(KEY_SETTING_SAVE_BUTTON_ID)
    saveButton.onclick = () => {
      this.closePopUpWindowButton()
      // 保存する処理
      this.saveChanges()
    }
  }

  /**
   * キーバインド設定フォームに入力されたキー変更を保存する
   */
  private saveChanges(): void {
    this.willBindingKeys.forEach((keyCode, keyEvent) => {
      this.keyboardHelper?.rebindKey(keyEvent, keyCode)
      this.currentBindingKeys.set(keyEvent, keyCode)
    })
  }

  /**
   * キーバインド設定フォームに入力されたキー変更をキャンセルする
   */
  private cancelChanges(): void {
    this.currentBindingKeys.forEach((keyCode, keyEvent) => {
      const tableRow = DomManager.getElementById<HTMLTableRowElement>(KEY_SETTING_TABLE_ROW_ID(keyEvent))
      const keyCodeCell = tableRow.cells[1].children[0] as HTMLInputElement
      keyCodeCell.value = keyCode
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * popUpWindowを非表示にする
   */
  public closePopupWindow(): void {
    this.popUpWindow.style.display = 'none'
  }

  /**
   * popUpWindowを表示する
   */
  public openPopupWindow(): void {
    this.popUpWindow.style.display = 'block'
  }
}
