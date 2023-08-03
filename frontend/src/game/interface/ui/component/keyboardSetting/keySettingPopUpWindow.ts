import { GameObjects, Scene } from 'phaser'
import { IKeyboardSettingPopUpWindow } from '../../../../domain/IRender/IKeySettingPopUpWindow'
import { Interactor } from '../../../../interactor/Interactor'
import { KeyboardHelper } from '../../../keyboard/keyboardHelper'
import { TextFieldObserver } from '../../util/textFieldObserver'
import { createUIContainer } from '../../util/container'
import { KeyCode, KeyEvent } from '../../../../domain/model/core/types'

/**
 * キー設定フォームのHTMLのkey
 */
const KEY_SETTING_FORM_KEY = 'keySettingForm'

/**
 * キー設定フォームのHTMLのパス
 */
const KEY_SETTING_FORM_PATH = 'assets/keySettingForm.html'

/**
 * キー設定用テーブルのID
 */
const KEY_SETTING_TABLE_ID = 'keySetting-table'

/**
 * キー設定フォームを保存せず閉じるボタン要素名
 */
const CANCEL_CHANGES_BUTTON_NAME = 'cancel-button'

/**
 * キー設定フォームを保存して閉じるボタン要素名
 */
const SAVE_CHANGES_BUTTON_NAME = 'apply-button'

export class KeyboardSettingPopUpWindow implements IKeyboardSettingPopUpWindow {
  private interactor?: Interactor
  private keyboardHelper?: KeyboardHelper
  /**
   * 変更するキーの入力を保存する配列
   */
  private readonly willBindingKeys: Map<KeyEvent, KeyCode>
  /**
   * 変更前のキーを保存する配列
   */
  private readonly currentBindingKeys: Map<KeyEvent, KeyCode>
  /**
   * キーバインド設定フォーム + 閉じるボタン
   */
  public popUpWindow: Phaser.GameObjects.DOMElement
  private readonly container: GameObjects.Container

  private constructor(private readonly scene: Scene) {
    this.willBindingKeys = new Map<KeyEvent, KeyCode>()
    this.currentBindingKeys = new Map<KeyEvent, KeyCode>()
    this.container = createUIContainer(scene, 1, 0, -50, 150)
    // キー設定フォームの定義
    this.popUpWindow = scene.add
      .dom(-750, 0)
      .createFromCache(KEY_SETTING_FORM_KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setVisible(false)
    this.container.add(this.popUpWindow)
    // コンテナ内の要素のdepthは失われるので以下で重ね順を制御
    // https://www.html5gamedevs.com/topic/38740-image-depth-in-container-doesnt-work/
    this.container.sendToBack(this.popUpWindow)

    this.onClickCancelChangesButton()
    this.onClickSavaChangesButton()
  }

  public static async build(scene: Scene): Promise<KeyboardSettingPopUpWindow> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(KEY_SETTING_FORM_KEY)) {
        resolve()
      }

      scene.load.html(KEY_SETTING_FORM_KEY, KEY_SETTING_FORM_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new KeyboardSettingPopUpWindow(scene)
    })
  }

  /**
   * キーバインド設定ウィンドウを閉じる
   */
  private closePopUpWindowButton(): void {
    if (this.interactor === undefined) return
    this.interactor.closeKeySettingPopUPWindow()
  }

  /**
   * 保存せず終了ボタンを押した時の処理
   */
  private onClickCancelChangesButton(): void {
    const cancelAndClose = this.popUpWindow.getChildByID(CANCEL_CHANGES_BUTTON_NAME)
    if (cancelAndClose === null) return
    cancelAndClose.addEventListener('pointerdown', () => {
      this.closePopUpWindowButton()
      // 保存取り消し＆表示の切り替え処理
      this.cancelChanges()
    })
  }

  /**
   * 保存して終了ボタン押した時の処理
   */
  private onClickSavaChangesButton(): void {
    const saveAndClose = this.popUpWindow.getChildByID(SAVE_CHANGES_BUTTON_NAME)
    if (saveAndClose !== null) {
      saveAndClose.addEventListener('pointerdown', () => {
        this.closePopUpWindowButton()
        // 保存する処理
        this.saveChanges()
      })
    }
  }

  /**
   * キーイベントとキーを持った列の作成
   */
  private addRowKeySetting(
    eventName: KeyEvent,
    key: KeyCode,
    textFieldObserver: TextFieldObserver
  ): HTMLTableRowElement {
    const input = this.createInputElement(eventName, key, textFieldObserver)
    const keyCodeCell = this.createKeyCodeCell(input)
    const eventCell = this.createEventCell(eventName)
    const keyBindingRowElement = this.createRow(eventCell, keyCodeCell)
    keyBindingRowElement.id = eventName
    return keyBindingRowElement
  }

  /**
   * キー設定フォームをつくる関数
   */
  private createTable(textFieldObserver: TextFieldObserver): void {
    // HTMLのtable要素を取得
    const table = document.getElementById(KEY_SETTING_TABLE_ID) as HTMLTableElement
    // テーブルに追加する要素の作成
    this.currentBindingKeys.forEach((keyCode, keyEvent) => {
      const keyBindingRowElement = this.addRowKeySetting(keyEvent, keyCode, textFieldObserver)
      // テーブルに追加
      table.appendChild(keyBindingRowElement)
    })
  }

  /**
   * tableに追加する列を作成
   */
  private createRow(eventCell: HTMLTableCellElement, keyCodeCell: HTMLTableCellElement): HTMLTableRowElement {
    const newRow = document.createElement('tr')
    newRow.appendChild(eventCell)
    newRow.appendChild(keyCodeCell)
    return newRow
  }

  /**
   * tableの要素となるkeyEvent要素を作成
   */
  private createEventCell(eventName: KeyEvent): HTMLTableCellElement {
    // 新しいセルを作成して行に追加
    const eventCell = document.createElement('td')
    eventCell.textContent = eventName
    return eventCell
  }

  /**
   * tableの要素となるkeyCode要素を作成
   */
  private createKeyCodeCell(inputElement: HTMLInputElement): HTMLTableCellElement {
    // 新しいセルを作成して行に追加
    const keyCodeCell = document.createElement('td')
    keyCodeCell.appendChild(inputElement)
    return keyCodeCell
  }

  /**
   * 入力されたキーのキーコードを表示させる
   */
  private createInputElement(
    eventName: KeyEvent,
    key: KeyCode,
    textFieldObserver: TextFieldObserver
  ): HTMLInputElement {
    const input = document.createElement('input')
    textFieldObserver.addTargetTextField(input)
    input.style.textAlign = 'center'
    input.value = key
    // input欄にキー入力をそのまま表示させないように制御してます
    input.setAttribute('readonly', 'readonly')

    // 押されたキーのキーコードを習得
    this.scene.input.keyboard.on('keydown', (e: { key: any }) => {})
    input.addEventListener('keydown', (event) => {
      const key = event.key.replace(/Arrow/g, '').toUpperCase()
      input.value = key
      this.willBindingKeys.set(eventName, key as KeyCode)
    })
    return input
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
      const tableRow = document.getElementById(keyEvent) as HTMLTableRowElement
      const keyCodeCell = tableRow.cells[1].children[0] as HTMLInputElement
      keyCodeCell.value = keyCode
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  public setKeyboardHelper(keyboardHelper: KeyboardHelper): void {
    this.keyboardHelper = keyboardHelper
  }

  /**
   * 一番初めにキーバインド設定フォームを作成するための関数
   */
  public setKeyboardPreference(textFieldObserver: TextFieldObserver): void {
    const keys = this.interactor?.getKeyPreference()
    if (keys === undefined) return
    keys.forEach((keyCode, keyEvent) => {
      this.currentBindingKeys.set(keyEvent, keyCode)
    })
    this.createTable(textFieldObserver)
  }

  /**
   * popUpWindowを非表示にする
   */
  public closePopupWindow(): void {
    this.popUpWindow.setVisible(false)
  }

  /**
   * popUpWindowを表示する
   */
  public openPopupWindow(): void {
    this.popUpWindow.setVisible(true)
  }
}
