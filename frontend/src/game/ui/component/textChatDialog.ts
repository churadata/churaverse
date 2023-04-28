import { GameObjects, Scene } from 'phaser'
import { IDialog } from '../../domain/IRender/IDialog'
import { createUIContainer } from '../container'

/**
 * テキストチャットに関するUI
 */
export class TextChatDialog implements IDialog {
  private readonly container: GameObjects.Container
  private _isOpen = false

  private constructor(scene: Scene) {
    this.container = createUIContainer(scene, 1, 0, -100, 100)
    this.container.setVisible(false)
  }

  public static async build(scene: Scene): Promise<TextChatDialog> {
    return await new Promise<void>((resolve) => {
      resolve()
    }).then(() => {
      return new TextChatDialog(scene)
    })
  }

  /**
   * dialog内の要素を追加する
   * @param component 追加したい要素
   */
  public add(component: GameObjects.GameObject): void {
    this.container.add(component)
  }

  public open(): void {
    this._isOpen = true
    this.container.setVisible(true)
  }

  public close(): void {
    this._isOpen = false
    this.container.setVisible(false)
  }

  public get isOpen(): boolean {
    return this._isOpen
  }
}
