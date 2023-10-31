import { Scene } from 'phaser'
import { Position } from '../../../../domain/model/core/position'
import { layerSetting } from '../../util/canvasLayer'
import { ISharedScreenRender } from '../../../../domain/IRender/ISharedScreenRender'

export class SharedScreenRender implements ISharedScreenRender {
  private readonly _video: Phaser.GameObjects.Video
  public readonly video: MediaStream

  private constructor(
    private readonly scene: Scene,
    stream: MediaStream,
    private readonly position: Position,
    private readonly width: number,
    private readonly height: number
  ) {
    this.video = stream
    this._video = this.scene.add
      .video(position.x, position.y)
      .loadMediaStream(
        // @ts-expect-error
        stream,
        'loadeddata',
        false
      )
      .play()

    layerSetting(this._video, 'ground')

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update.bind(this))
  }

  public static async build(
    scene: Scene,
    mediaStream: MediaStream,
    position: Position = new Position(800 - 20, 400 - 20),
    width: number = 1280,
    height: number = 720
  ): Promise<SharedScreenRender> {
    return new SharedScreenRender(scene, mediaStream, position, width, height)
  }

  private update(): void {
    // タイミングによってはundefinedになるため
    if (this._video.video == null || this._video.video.videoWidth <= 0) {
      return
    }

    this.fitScale()
  }

  /**
   * 共有された画面の比率に合わせて大きさを調整
   */
  private fitScale(): void {
    const videoWidth = this._video.video.videoWidth
    const videoHeight = this._video.video.videoHeight

    const xRatio = this.width / videoWidth
    const yRatio = this.height / videoHeight

    try {
      if (xRatio <= yRatio) {
        this._video.setDisplaySize(this.width, videoHeight * xRatio)
      } else {
        this._video.setDisplaySize(videoWidth * yRatio, this.height)
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== 'TypeError') {
          console.error(`${error.name}: ${error.message}`)
        }
      }
    }
  }

  public destroy(): void {
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update.bind(this))
    this._video.removeVideoElement()
    this._video.destroy()
  }

  public focus(): void {
    this.scene.cameras.main.startFollow(this._video)
  }
}
