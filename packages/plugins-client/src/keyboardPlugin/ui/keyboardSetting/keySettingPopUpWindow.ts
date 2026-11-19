import { DomManager, domLayerSetting, type IMainScene, makeLayerHigherTemporary } from 'churaverse-engine-client'
import type { IKeyActionKeyCodeBinder } from '../../interface/IKeyActionKeyCodeBinder'
import type { IKeyActionRegister } from '../../interface/IKeyActionRegister'
import type { KeyActionType } from '../../keyAction/keyActions'
import type { KeyCode } from '../../types/keyCode'
import type { IKeyboardSettingPopUpWindow } from '../interface/IKeySettingPopUpWindow'
import type { CanSettingKeyActType } from './canSettingKeyActionType'
import { KeySettingPopupWindowComponent, KeySettingTableRow } from './components/KeySettingPopupWindowComponent'

/**
 * キー設定を保存してウィンドウを閉じるボタンのid
 */
export const KEY_SETTING_SAVE_BUTTON_ID = 'key-setting-save'

/**
 * キー設定を保存せずウィンドウを閉じるボタンのid
 */
export const KEY_SETTING_CANCEL_BUTTON_ID = 'key-setting-cancel'

/**
 * キー設定の入力部分のtableのid
 */
export const KEY_SETTING_TABLE_ID = 'key-setting-table'

/**
 * キーイベントとキー入力用inputのペアをまとめた要素のid
 */
export const KEY_SETTING_TABLE_ROW_ID: (keyEvent: KeyActionType<IMainScene>) => string = (
  keyEvent: KeyActionType<IMainScene>
) => {
  return `key-setting-table-row-${keyEvent}`
}

export class KeyboardSettingPopUpWindow implements IKeyboardSettingPopUpWindow {
  /**
   * 変更するキーの入力を保存する配列
   */
  private readonly willBindingKeys = new Map<KeyActionType<IMainScene>, KeyCode>()

  /**
   * 変更前のキーを保存する配列
   */
  private readonly currentBindingKeys = new Map<KeyActionType<IMainScene>, KeyCode>()

  private readonly popUpWindow: HTMLElement
  private readonly inputTable: HTMLTableSectionElement

  public constructor(
    private readonly keyActionRebinder: IKeyActionKeyCodeBinder<IMainScene>,
    private readonly keyActionRegister: IKeyActionRegister<IMainScene>
  ) {
    this.popUpWindow = DomManager.addJsxDom(KeySettingPopupWindowComponent())
    this.inputTable = DomManager.getElementById<HTMLTableSectionElement>(KEY_SETTING_TABLE_ID)

    domLayerSetting(this.popUpWindow, 'higher')
    this.popUpWindow.addEventListener('mousedown', () => {
      makeLayerHigherTemporary(this.popUpWindow, 'higher')
    })

    this.setupCancelButton()
    this.setupSaveButton()

    this.closePopupWindow()
  }

  /**
   * 引数で指定したキーイベント用のinputの初期設定を行う
   */
  private setupInput(keyActType: CanSettingKeyActType, key: KeyCode): HTMLInputElement {
    const row = DomManager.getElementById<HTMLTableRowElement>(KEY_SETTING_TABLE_ROW_ID(keyActType))

    const input = row.children[1].children[0]
    if (!(input instanceof HTMLInputElement))
      throw Error(`id=${KEY_SETTING_TABLE_ROW_ID(keyActType)}の要素はHTMLInputElementではない`)

    input.value = key
    // input欄にキー入力をそのまま表示させないように制御してます
    input.setAttribute('readonly', 'readonly')

    // 押されたキーのキーコードを習得
    input.addEventListener('keydown', (event) => {
      const key = event.key.replace(/Arrow/g, '').toUpperCase()
      input.value = key
      this.willBindingKeys.set(keyActType, key as KeyCode)
    })
    return input
  }

  /**
   * キャンセルボタンを押した時の挙動を設定する
   */
  private setupCancelButton(): void {
    const cancelButton = DomManager.getElementById(KEY_SETTING_CANCEL_BUTTON_ID)
    cancelButton.addEventListener('click', () => {
      this.closePopupWindow()
      // 保存取り消し＆表示の切り替え処理
      this.cancelChanges()
    })
  }

  /**
   * 保存ボタンを押した時の挙動を設定する
   */
  private setupSaveButton(): void {
    const saveButton = DomManager.getElementById(KEY_SETTING_SAVE_BUTTON_ID)
    saveButton.addEventListener('click', () => {
      this.closePopupWindow()
      // 保存する処理
      this.saveChanges()
    })
  }

  /**
   * キーバインド設定フォームに入力されたキー変更を保存する
   */
  private saveChanges(): void {
    this.willBindingKeys.forEach((keyCode, keyActType) => {
      this.keyActionRebinder.rebindKey(keyActType, keyCode)
      this.currentBindingKeys.set(keyActType, keyCode)
    })
  }

  /**
   * キーバインド設定フォームに入力されたキー変更をキャンセルする
   */
  private cancelChanges(): void {
    this.currentBindingKeys.forEach((keyCode, keyEvent) => {
      const tableRow = DomManager.getElementById<HTMLDivElement>(KEY_SETTING_TABLE_ROW_ID(keyEvent))
      const keyCodeCell = tableRow.children[1] as HTMLInputElement
      keyCodeCell.value = keyCode
    })
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

  public addKeyAction(type: CanSettingKeyActType, description: string, order = 0): void {
    const keyAction = this.keyActionRegister.getRegistered(type)
    const keyCode = keyAction.keyCode
    this.inputTable.appendChild(
      DomManager.jsxToDom(
        KeySettingTableRow({
          type,
          keyCode,
          description,
          order,
        })
      )
    )

    this.currentBindingKeys.set(keyAction.type, keyCode)
    this.willBindingKeys.set(keyAction.type, keyCode)

    this.setupInput(keyAction.type, keyCode)
  }

  public removeKeyAction(type: CanSettingKeyActType): void {
    const row = DomManager.getElementById<HTMLTableRowElement>(KEY_SETTING_TABLE_ROW_ID(type))
    if (row !== undefined) {
      this.inputTable.removeChild(row)
    }

    this.willBindingKeys.delete(type)
    this.currentBindingKeys.delete(type)
  }
}
