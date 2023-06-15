import { GameObjects, Scene } from 'phaser'
import { createUIContainer } from '../../util/container'
import { ITitleNameFieldRender } from '../../../../domain/IRender/ITitlenamefieldRender'

/**
 * 名前入力フォームのHTMLのKey
 */
const TITLE_NAME_FORM_KEY = 'title-name-form'

/**
 * 名前入力フォームのHTMLのパス
 */
const TITLE_NAME_FORM_PATH = 'assets/title_nameform.html'

/**
 * 名前入力フォーム内にあるテキストフィールド要素のname
 */
const TITLE_FIELD_NAME = 'title-name-field'

export class TitleNameFieldRender implements ITitleNameFieldRender {
  /**
   * 名前入力欄
   */
  private readonly inputNameArea?: Phaser.GameObjects.DOMElement
  private readonly container: GameObjects.Container

  private constructor(scene: Scene, name: string | undefined) {
    this.inputNameArea = scene.add.dom(0, 0).createFromCache(TITLE_NAME_FORM_KEY).setOrigin(0.5).setScrollFactor(0)
    this.container = createUIContainer(scene, 0.5, 0.55)
    const nameElement = this.inputNameArea?.getChildByID(TITLE_FIELD_NAME) as HTMLInputElement
    nameElement.value = name ?? ''
    this.container.add(this.inputNameArea)
  }

  public static async build(scene: Scene, name: string | undefined): Promise<TitleNameFieldRender> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(TITLE_NAME_FORM_KEY)) {
        resolve()
      }
      // 名前入力欄の読み込み
      scene.load.html(TITLE_NAME_FORM_KEY, TITLE_NAME_FORM_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new TitleNameFieldRender(scene, name)
    })
  }

  public getName(): string {
    return (this.inputNameArea?.getChildByID(TITLE_FIELD_NAME) as HTMLInputElement).value
  }
}
