import {
  LocalParticipant,
  LocalTrackPublication,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
} from 'livekit-client'
import { Scene } from 'phaser'
import { v4 as uuidv4 } from 'uuid'
import { layerSetting } from '../layer'

/**
 * backend_livekitが返すアクセストークンのJSON
 */
interface AccessTokenResponse {
  token: string
}

export class WebRtcChat {
  private readonly audioElements = new Map<string, HTMLMediaElement>()
  private readonly videoViews = new Map<string, VideoView>()

  private controlsContainer: Phaser.GameObjects.Container | undefined
  private micButton: ToggleButton | undefined
  private cameraButton: ToggleButton | undefined
  private screenshareButton: ToggleButton | undefined

  private constructor(private readonly scene: Scene, private readonly room: Room) {
    this.create()
  }

  public static async build(scene: Scene, room: Room): Promise<WebRtcChat> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists('microphone')) {
        resolve()
      }

      scene.load.image('microphone', 'assets/microphone.png')
      scene.load.image('microphone_off', 'assets/microphone_off.png')
      scene.load.image('video', 'assets/video.png')
      scene.load.image('video_off', 'assets/video_off.png')
      scene.load.image('screenshare', 'assets/screenshare.png')
      scene.load.image('screenshare_off', 'assets/screenshare_off.png')

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new WebRtcChat(scene, room)
    })
  }

  public create(): void {
    this.setupButtons()

    this.room
      .on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed.bind(this))
      .on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed.bind(this))
      .on(RoomEvent.LocalTrackPublished, this.handleLocalTrackPublished.bind(this))
      .on(RoomEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished.bind(this))

    void this.connect()
  }

  private setupButtons(): void {
    this.controlsContainer = this.scene.add
      .container(this.scene.scale.gameSize.width - 50 - 150, 50) // gameSize.width - margin - position
      .setScrollFactor(0)
    layerSetting(this.controlsContainer, 'WebRtcUI')

    this.scene.scale.on(
      Phaser.Scale.Events.RESIZE,
      (
        gameSize: Phaser.Structs.Size,
        baseSize: Phaser.Structs.Size,
        displaySize: Phaser.Structs.Size,
        previousWidth: number,
        previousHeight: number
      ) => {
        if (this.controlsContainer != null) {
          // gameSize.width - margin - position
          this.controlsContainer.setPosition(gameSize.width - 50 - 150, 50)
        }
      }
    )

    this.setupMicButton()
    this.setupCameraButton()
    this.setupScreenshareButton()
  }

  private setupMicButton(): void {
    this.micButton = new ToggleButton(this.scene, -100, 0, 'microphone', 'microphone_off')
    this.micButton.button.setOrigin(1, 0)
    this.controlsContainer?.add(this.micButton.button)

    this.micButton.button.setInteractive().on('pointerup', () => {
      if (this.micButton != null) {
        this.micButton.isEnabled = false
      }

      const enabled = this.room.localParticipant.isMicrophoneEnabled

      this.room.localParticipant.setMicrophoneEnabled(!enabled).finally(() => {
        if (this.micButton != null) {
          this.micButton.isOn = this.room.localParticipant.isMicrophoneEnabled
          this.micButton.isEnabled = true
        }
      })
    })
  }

  private setupCameraButton(): void {
    this.cameraButton = new ToggleButton(this.scene, -50, 0, 'video', 'video_off')
    this.cameraButton.button.setOrigin(1, 0)
    this.controlsContainer?.add(this.cameraButton.button)

    this.cameraButton.button.setInteractive().on('pointerup', () => {
      alert('現在、機能の提供を停止しています。')

      // if (this.cameraButton != null) {
      //   this.cameraButton.isEnabled = false
      // }

      // const enabled = this.room.localParticipant.isCameraEnabled

      // if (!enabled && this.videoViews.size > 0) {
      //   alert('他のユーザーが共有中です。')
      //   if (this.cameraButton != null) {
      //     this.cameraButton.isEnabled = true
      //   }
      //   return
      // }

      // this.room.localParticipant
      //   .setCameraEnabled(!enabled, {
      //     resolution: { width: 1280, height: 720 },
      //   })
      //   .finally(() => {
      //     if (this.cameraButton != null) {
      //       this.cameraButton.isOn =
      //         this.room.localParticipant.isCameraEnabled
      //       this.cameraButton.isEnabled = true
      //     }
      //   })
    })
  }

  private setupScreenshareButton(): void {
    this.screenshareButton = new ToggleButton(this.scene, 0, 0, 'screenshare', 'screenshare_off')
    this.screenshareButton.button.setOrigin(1, 0)
    this.controlsContainer?.add(this.screenshareButton.button)

    this.screenshareButton.button.setInteractive().on('pointerup', () => {
      if (this.screenshareButton != null) {
        this.screenshareButton.isEnabled = false
      }

      const enabled = this.room.localParticipant.isScreenShareEnabled

      if (!enabled && this.videoViews.size > 0) {
        alert('他のユーザーが共有中です。')
        if (this.screenshareButton != null) {
          this.screenshareButton.isEnabled = true
        }
        return
      }

      this.room.localParticipant
        .setScreenShareEnabled(!enabled, {
          resolution: { width: 1280, height: 720 },
        })
        .finally(() => {
          if (this.screenshareButton != null) {
            this.screenshareButton.isOn = this.room.localParticipant.isScreenShareEnabled
            this.screenshareButton.isEnabled = true
          }
        })
    })
  }

  private attachAudio(participant: LocalParticipant | RemoteParticipant): void {
    if (this.audioElements.has(participant.identity)) {
      return
    }

    const track = participant.getTrack(Track.Source.Microphone)
    if (track?.audioTrack == null || track.track == null) {
      return
    }

    const e = track.track.attach()
    this.audioElements.set(participant.identity, e)
  }

  private detachAudio(participant: LocalParticipant | RemoteParticipant): void {
    const track = participant.getTrack(Track.Source.Microphone)
    track?.track?.detach()
    this.audioElements.delete(participant.identity)
  }

  private attachVideo(participant: LocalParticipant | RemoteParticipant): void {
    if (this.videoViews.has(participant.identity)) {
      return
    }

    const track = participant.getTrack(Track.Source.ScreenShare)
    if (track?.videoTrack == null) {
      return
    }

    const mediaStream = new MediaStream()
    mediaStream.addTrack(track.videoTrack.mediaStreamTrack)
    const videoView = new VideoView(
      mediaStream,
      this.scene,
      800 - 20, // 20はタイル幅の半分
      400 - 20,
      1280,
      720
    )
    this.videoViews.set(participant.identity, videoView)
  }

  private detachVideo(participant: LocalParticipant | RemoteParticipant): void {
    this.videoViews.get(participant.identity)?.clear()
    this.videoViews.delete(participant.identity)
  }

  private handleTrackSubscribed(
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant
  ): void {
    if (track.kind === Track.Kind.Audio) {
      this.attachAudio(participant)
    } else if (track.kind === Track.Kind.Video) {
      this.attachVideo(participant)
    }
  }

  private handleTrackUnsubscribed(
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant
  ): void {
    if (track.kind === Track.Kind.Audio) {
      this.detachAudio(participant)
    } else if (track.kind === Track.Kind.Video) {
      this.detachVideo(participant)
    }
  }

  private handleLocalTrackPublished(publication: LocalTrackPublication, participant: LocalParticipant): void {
    this.attachVideo(participant)
  }

  private handleLocalTrackUnpublished(publication: LocalTrackPublication, participant: LocalParticipant): void {
    this.detachVideo(participant)

    if (this.cameraButton != null) {
      this.cameraButton.isOn = this.room.localParticipant.isCameraEnabled
    }
    if (this.screenshareButton != null) {
      this.screenshareButton.isOn = this.room.localParticipant.isScreenShareEnabled
    }
  }

  private async connect(): Promise<void> {
    try {
      const token = await this.getAccessToken()
      await this.room.connect(`${import.meta.env.VITE_LIVEKIT_URL ?? 'ws://localhost:8080/livekit'}`, token)
      console.log(`connected to room. roomName: ${this.room.name}`)
    } catch {
      console.error(`Failed to connect to room.`)
    }
  }

  private async getAccessToken(): Promise<string> {
    const params = {
      roomName: 'room1',
      userName: uuidv4(),
    }
    const query = new URLSearchParams(params).toString()
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_LIVEKIT_URL ?? 'http://localhost:8080/backend_livekit'}/?${query}`
    )
    const data = (await res.json()) as AccessTokenResponse
    return data.token
  }

  public getVideo(): Phaser.GameObjects.Video | null {
    if (this.videoViews.size <= 0) {
      return null
    }
    // 現在のところ画面共有は全員で１画面のみに制限しているため最初の値を返す
    const iteratorResult = this.videoViews.values().next()
    if (iteratorResult.done ?? false) {
      return null
    } else {
      return iteratorResult.value.video
    }
  }
}

class ToggleButton {
  private readonly scene: Scene

  public readonly button: Phaser.GameObjects.Image

  private readonly buttonOnTexture: string
  private readonly buttonOfftexture: string

  private _isOn = false
  private _isEnabled = true

  public constructor(scene: Scene, x: number, y: number, buttonOnTexture: string, buttonOfftexture: string) {
    this.scene = scene

    this.buttonOnTexture = buttonOnTexture
    this.buttonOfftexture = buttonOfftexture

    this.button = this.scene.add
      .image(x, y, this.buttonOfftexture)
      .setAlpha(0.5)
      .setDisplaySize(40, 40)
      .setScrollFactor(0)
  }

  public get isOn(): boolean {
    return this._isOn
  }

  public set isOn(isOn: boolean) {
    this._isOn = isOn

    if (this._isOn) {
      this.button.setTexture(this.buttonOnTexture)
      this.button.setAlpha(1)
    } else {
      this.button.setTexture(this.buttonOfftexture)
      this.button.setAlpha(0.5)
    }
  }

  public get isEnabled(): boolean {
    return this._isEnabled
  }

  public set isEnabled(isEnabled: boolean) {
    this._isEnabled = isEnabled

    if (this._isEnabled) {
      this.button.setInteractive()
    } else {
      this.button.disableInteractive()
    }
  }
}

class VideoView {
  private readonly scene: Scene

  private readonly x: number
  private readonly y: number
  private readonly width: number
  private readonly height: number

  public readonly video: Phaser.GameObjects.Video

  public constructor(stream: MediaStream, scene: Scene, x = 0, y = 0, width = 320, height = 240) {
    this.scene = scene
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.video = this.scene.add
      .video(this.x, this.y)
      .loadMediaStream(
        // @ts-expect-error
        stream,
        'loadeddata',
        false
      )
      .play()
    layerSetting(this.video, 'Video')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update.bind(this))
  }

  private update(): void {
    // タイミングによってはundefinedになるため
    if (this.video.video == null || this.video.video.videoWidth <= 0) {
      return
    }

    const videoWidth = this.video.video.videoWidth
    const videoHeight = this.video.video.videoHeight

    const xRatio = this.width / videoWidth
    const yRatio = this.height / videoHeight

    try {
      if (xRatio <= yRatio) {
        this.video.setDisplaySize(this.width, videoHeight * xRatio)
      } else {
        this.video.setDisplaySize(videoWidth * yRatio, this.height)
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== 'TypeError') {
          console.error(`${error.name}: ${error.message}`)
        }
      }
    }
  }

  public clear(): void {
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update.bind(this))
    this.video.removeVideoElement()
    this.video.destroy()
  }
}
