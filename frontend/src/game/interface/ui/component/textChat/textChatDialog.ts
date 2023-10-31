import { Scene } from 'phaser'
import { IDialog } from '../../../../domain/IRender/IDialog'
import { DomManager } from '../../util/domManager'
import { TextChatDialogPanelComponent } from './components/TextChatPanelComponent'
import { TextChatBoard } from './textChatBoard'
import { TextChatInput } from './textChatInput'
import { TextFieldObserver } from '../../util/textFieldObserver'
import { domLayerSetting } from '../../util/domLayer'
import { makeLayerHigherTemporary } from '../../util/makeLayerHigherTemporary'

/**
 * テキストチャットに関するUI
 */
export class TextChatDialog implements IDialog {
  private readonly components: TextChatDialogComponents
  private readonly panelElement: HTMLElement
  private _isOpen = false

  private constructor(scene: Scene, playerId: string, textFieldObserver: TextFieldObserver) {
    this.panelElement = DomManager.addJsxDom(TextChatDialogPanelComponent())
    domLayerSetting(this.panelElement, 'low')
    this.panelElement.addEventListener('mousedown', () => {
      makeLayerHigherTemporary(this.panelElement, 'low')
    })
    this.components = {
      chatBoard: new TextChatBoard(playerId),
      chatInput: new TextChatInput(playerId, textFieldObserver),
    }

    this.close()
  }

  public static async build(
    scene: Scene,
    playerId: string,
    textFieldObserver: TextFieldObserver
  ): Promise<TextChatDialog> {
    return await new Promise<void>((resolve) => {
      resolve()
    }).then(() => {
      return new TextChatDialog(scene, playerId, textFieldObserver)
    })
  }

  /**
   * dialog内の要素を追加する
   * @param component 追加したい要素
   */
  public add(component: HTMLElement): void {
    this.panelElement.appendChild(component)
  }

  public open(): void {
    this._isOpen = true
    this.panelElement.style.display = 'flex'
  }

  public close(): void {
    this._isOpen = false
    this.panelElement.style.display = 'none'
  }

  public get isOpen(): boolean {
    return this._isOpen
  }
}

interface TextChatDialogComponents {
  chatBoard: TextChatBoard
  chatInput: TextChatInput
}
