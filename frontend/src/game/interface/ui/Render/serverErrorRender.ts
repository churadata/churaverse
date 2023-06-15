import { GameObjects, Scene } from 'phaser'
import { IServerErrorRender } from '../../../domain/IRender/IServerErrorRender'

/** フォームのテクスチャ名 */
const SERVER_ERROR_FORM_TEXTURE_NAME = 'reloadform'

/** フォームのファイル名 */
const SERVER_ERROR_FORM_FILE_NAME = 'assets/reloadform.html'

/**
 * ServerからErrorが送られてきたときに表示する画面
 */
export class ServerErrorRender implements IServerErrorRender {
  public panelContainer: GameObjects.Container
  public constructor(private readonly scene: Scene) {
    this.panelContainer = this.scene.add.container()
    const reloadButton = this.scene.add
      .dom(0, 0)
      .createFromCache(SERVER_ERROR_FORM_TEXTURE_NAME)
      .setOrigin(0, 0)
      .setScrollFactor(0)
    this.panelContainer.add(reloadButton)
  }

  /**
   * initilizer
   * @param scene 表示されるシーン
   * @returns 画面を表示する
   */
  public static async build(scene: Scene): Promise<ServerErrorRender> {
    return await new Promise<void>((resolve) => {
      // textureがロードされているかの確認
      if (scene.textures.exists(SERVER_ERROR_FORM_TEXTURE_NAME)) {
        resolve()
      }

      scene.load.html(SERVER_ERROR_FORM_TEXTURE_NAME, SERVER_ERROR_FORM_FILE_NAME)
      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new ServerErrorRender(scene)
    })
  }

  public show(): void {
    this.panelContainer.visible = true
    const send = document.getElementById('reload-button')
    if (send != null) {
      send.onclick = () => window.location.reload()
    }
  }
}
