import { GameObjects, Scene } from 'phaser'
import { IDialog } from '../../../../domain/IRender/IDialog'
import { createUIContainer } from '../../util/container'

/** 背景パネルのテクスチャ名 */
const BACKGROUND_TEXTURE_NAME = 'settingPanel'

/** 背景パネルの画像のパス */
const BACKGROUND_IMAGE_PATH = 'assets/grey_panel.png'

/**
 * 管理者専用の設定に関するUI
 */
export class AdminSettingDialog implements IDialog {
  private readonly container: GameObjects.Container
  private _isOpen = false

  private constructor(scene: Scene) {
    this.container = createUIContainer(scene, 1, 0, -50, 150)
    this.container.setVisible(false)

    // 背景パネルを描画
    // https://github.com/jdotrjs/phaser3-nineslice
    // prettier-ignore
    const panel = scene.add
      .nineslice(
        0, -50, // 始点のxとy
        340, 180, // オブジェクトのサイズ
        BACKGROUND_TEXTURE_NAME, // 読み込んである画像
        88, // ブロック１の幅と高さ
        24 // 枠のピクセル数
      )
      .setOrigin(1, 0)
      .setScrollFactor(0)
    this.container.add(panel)

    // コンテナ内の要素のdepthは失われるので以下で重ね順を制御
    // https://www.html5gamedevs.com/topic/38740-image-depth-in-container-doesnt-work/
    this.container.sendToBack(panel)
  }

  public static async build(scene: Scene): Promise<AdminSettingDialog> {
    // 画像をロード
    return await new Promise<void>((resolve, reject) => {
      if (scene.textures.exists(BACKGROUND_TEXTURE_NAME)) {
        resolve()
      }

      scene.load.image(BACKGROUND_TEXTURE_NAME, BACKGROUND_IMAGE_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new AdminSettingDialog(scene)
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
