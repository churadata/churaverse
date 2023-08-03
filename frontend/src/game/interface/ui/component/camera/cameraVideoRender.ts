import { Scene } from 'phaser'

/**
 * カメラ映像表示スクリーンのHTMLのKey
 */
const CAMERA_VIDEO_SCREEN_KEY = 'cameraVideoScreen'

/**
 * カメラ映像表示スクリーンのHTMLのパス
 */
const CAMERA_VIDEO_SCREEN_PATH = 'assets/webCamera/cameraVideoScreen.html'

/**
 * スクリーンの各HTML要素をまとめているdivElementのid
 */
const SCREEN_CONTAINER_ID = 'screenContainer'

/**
 * HTML内のwebカメラ映像を表示するvideoElementのid
 */
const VIDEO_ELEMENT_ID = 'webCameraVideo'

/**
 * Webカメラの映像を表示するRender.
 * 1人の映像を表示する
 */
export class CameraVideoRender {
  private readonly videoScreenPhaserElement: Phaser.GameObjects.DOMElement
  private readonly screenContainer: HTMLDivElement
  private readonly videoElement: HTMLVideoElement
  private videoStream?: MediaStream

  private constructor(private readonly scene: Scene) {
    this.videoScreenPhaserElement = this.scene.add.dom(0, 0).createFromCache(CAMERA_VIDEO_SCREEN_KEY)

    this.screenContainer = this.videoScreenPhaserElement.getChildByID(SCREEN_CONTAINER_ID) as HTMLDivElement
    this.videoElement = this.videoScreenPhaserElement.getChildByID(VIDEO_ELEMENT_ID) as HTMLVideoElement
  }

  public static async build(scene: Scene): Promise<CameraVideoRender> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(CAMERA_VIDEO_SCREEN_KEY)) {
        resolve()
      }

      // チャット表示部分の読み込み
      scene.load.html(CAMERA_VIDEO_SCREEN_KEY, CAMERA_VIDEO_SCREEN_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new CameraVideoRender(scene)
    })
  }

  public get video(): MediaStream | undefined {
    return this.videoStream
  }

  public set video(stream: MediaStream | undefined) {
    this.videoStream = stream
    // streamがundefinedの場合は非表示
    if (stream === undefined) {
      this.screenContainer.style.display = 'none'
      return
    }

    this.screenContainer.style.display = 'block'
    this.videoElement.srcObject = this.videoStream ?? null
  }

  /**
   * このScreenの全要素を囲ったDivElementを返す
   */
  public getScreenContainer(): HTMLDivElement {
    return this.screenContainer
  }
}
