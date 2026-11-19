import type { IFocusTargetRepository } from '@churaverse/core-ui-plugin-client'
import { layerSetting, Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import type { IGroundScreenRenderer } from '../interface/IGroundScreenRenderer'

export class GroundScreenRenderer implements IGroundScreenRenderer {
  private readonly phaserVideo: Phaser.GameObjects.Video

  public constructor(
    private readonly scene: Scene,
    private readonly focusTargetRepository: IFocusTargetRepository,
    public readonly video: HTMLVideoElement,
    position: Position = new Position(800 - 20, 400 - 20),
    private readonly width: number = 1280,
    private readonly height: number = 720
  ) {
    this.phaserVideo = this.scene.add.video(position.x, position.y)

    const stream = this.video.srcObject
    if (stream !== undefined && stream instanceof MediaStream) {
      this.phaserVideo
        .loadMediaStream(
          stream,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          'loadeddata',
          false
        )
        .play()
    }

    layerSetting(this.phaserVideo, 'ground')
    this.focusTargetRepository.addFocusTarget(this)

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update.bind(this))
  }

  private update(): void {
    // タイミングによってはundefinedになるため
    if (this.phaserVideo.video == null || this.phaserVideo.video.videoWidth <= 0) {
      return
    }

    this.fitScale()
  }

  /**
   * 共有された画面の比率に合わせて大きさを調整
   */
  private fitScale(): void {
    const videoWidth = this.phaserVideo.video?.videoWidth ?? 1920
    const videoHeight = this.phaserVideo.video?.videoHeight ?? 1080

    const xRatio = this.width / videoWidth
    const yRatio = this.height / videoHeight

    try {
      if (xRatio <= yRatio) {
        this.phaserVideo.setDisplaySize(this.width, videoHeight * xRatio)
      } else {
        this.phaserVideo.setDisplaySize(videoWidth * yRatio, this.height)
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
    this.focusTargetRepository.removeFocusTarget(this)
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update.bind(this))
    this.phaserVideo.removeVideoElement()
    this.phaserVideo.destroy()
  }

  public focus(): void {
    this.scene.cameras.main.startFollow(this.phaserVideo)
  }
}
