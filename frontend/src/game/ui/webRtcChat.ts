import {
  LocalParticipant,
  LocalTrackPublication,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  RoomOptions,
  Track,
  VideoPresets,
} from 'livekit-client'
import { Scene } from 'phaser'
import { v4 as uuidv4 } from 'uuid'
import { layerSetting } from '../layer'

export class WebRtcChat {
  private readonly scene: Scene

  private readonly room: Room

  private readonly audioElements = new Map<string, HTMLMediaElement>()
  private readonly videoViews = new Map<string, VideoView>()

  private controlsContainer: Phaser.GameObjects.Container | undefined
  private micButton: ToggleButton | undefined
  private cameraButton: ToggleButton | undefined
  private screenshareButton: ToggleButton | undefined

  constructor(scene: Scene) {
    this.scene = scene

    const roomOptions: RoomOptions = {
      // automatically manage subscribed video quality
      // オンにしてはいけない。Phaserに映像が上手く流せなくなるため。
      // Phaserとの相性が悪いのか、実装方法が悪いのか、streamがずっとpause状態のままになってしまう。
      adaptiveStream: false,

      // optimize publishing bandwidth and CPU for published tracks
      dynacast: true,

      // default capture settings
      videoCaptureDefaults: {
        resolution: VideoPresets.h1080.resolution,
      },
    }

    this.room = new Room(roomOptions)
  }

  public loadAssets(): void {
    this.scene.load.image('microphone', 'assets/microphone.png')
    this.scene.load.image('microphone_off', 'assets/microphone_off.png')
    this.scene.load.image('video', 'assets/video.png')
    this.scene.load.image('video_off', 'assets/video_off.png')
    this.scene.load.image('screenshare', 'assets/screenshare.png')
    this.scene.load.image('screenshare_off', 'assets/screenshare_off.png')
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
    this.micButton = new ToggleButton(
      this.scene,
      -100,
      0,
      'microphone',
      'microphone_off'
    )
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
    this.cameraButton = new ToggleButton(
      this.scene,
      -50,
      0,
      'video',
      'video_off'
    )
    this.cameraButton.button.setOrigin(1, 0)
    this.controlsContainer?.add(this.cameraButton.button)

    this.cameraButton.button.setInteractive().on('pointerup', () => {
      alert('現在、機能の提供を停止しています。')
    })
  }

  private setupScreenshareButton(): void {
    this.screenshareButton = new ToggleButton(
      this.scene,
      0,
      0,
      'screenshare',
      'screenshare_off'
    )
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
            this.screenshareButton.isOn =
              this.room.localParticipant.isScreenShareEnabled
            this.screenshareButton.isEnabled = true
          }
        })
    })
  }

  private attachAudio(participant: LocalParticipant | RemoteParticipant): void {
    if (this.audioElements.has(participant.identity)) { return }

    const track = participant.getTrack(Track.Source.Microphone)
    if (track?.audioTrack == null || track.track == null) { return }

    const e = track.track.attach()
    this.audioElements.set(participant.identity, e)
  }

  private detachAudio(participant: LocalParticipant | RemoteParticipant): void {
    const track = participant.getTrack(Track.Source.Microphone)
    track?.track?.detach()
    this.audioElements.delete(participant.identity)
  }

  private attachVideo(participant: LocalParticipant | RemoteParticipant): void {
    if (this.videoViews.has(participant.identity)) { return }

    const track = participant.getTrack(Track.Source.ScreenShare)
    if (track?.videoTrack == null) { return }

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

  private handleLocalTrackPublished(
    publication: LocalTrackPublication,
    participant: LocalParticipant
  ): void {
    this.attachVideo(participant)
  }

  private handleLocalTrackUnpublished(
    publication: LocalTrackPublication,
    participant: LocalParticipant
  ): void {
    this.detachVideo(participant)

    if (this.cameraButton != null) {
      this.cameraButton.isOn = this.room.localParticipant.isCameraEnabled
    }
    if (this.screenshareButton != null) {
      this.screenshareButton.isOn =
        this.room.localParticipant.isScreenShareEnabled
    }
  }

  private async connect(): Promise<void> {
    try {
      const token = await this.getAccessToken()
      await this.room.connect(
        `${import.meta.env.VITE_LIVEKIT_URL ?? 'ws://localhost:8080/livekit'}`,
        token
      )
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
      `${
        import.meta.env.VITE_BACKEND_LIVEKIT_URL ??
        'http://localhost:8080/backend_livekit'
      }/?${query}`
    )
    const data = await res.json()
    return data.token
  }

  getVideo(): Phaser.GameObjects.Video | null {
    if (this.videoViews.size <= 0) { return null}
    // 現在のところ画面共有は全員で１画面のみに制限しているため最初の値を返す
    const videoView: VideoView = this.videoViews.values().next().value
    return videoView.video
  }
}

class ToggleButton {
  private readonly scene: Scene

  readonly button: Phaser.GameObjects.Image

  private readonly buttonOnTexture: string
  private readonly buttonOfftexture: string

  private _isOn: boolean = false
  private _isEnabled: boolean = true

  constructor(
    scene: Scene,
    x: number,
    y: number,
    buttonOnTexture: string,
    buttonOfftexture: string
  ) {
    this.scene = scene

    this.buttonOnTexture = buttonOnTexture
    this.buttonOfftexture = buttonOfftexture

    this.button = this.scene.add
      .image(x, y, this.buttonOfftexture)
      .setAlpha(0.5)
      .setDisplaySize(40, 40)
      .setScrollFactor(0)
  }

  get isOn(): boolean {
    return this._isOn
  }

  set isOn(isOn: boolean) {
    this._isOn = isOn

    if (this._isOn) {
      this.button.setTexture(this.buttonOnTexture)
      this.button.setAlpha(1)
    } else {
      this.button.setTexture(this.buttonOfftexture)
      this.button.setAlpha(0.5)
    }
  }

  get isEnabled(): boolean {
    return this._isEnabled
  }

  set isEnabled(isEnabled: boolean) {
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

  readonly video: Phaser.GameObjects.Video

  constructor(
    stream: MediaStream,
    scene: Scene,
    x: number = 0,
    y: number = 0,
    width: number = 320,
    height: number = 240
  ) {
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

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update.bind(this))
  }

  update(): void {
    // タイミングによってはundefinedになるため
    if (this.video.video == null || this.video.video.videoWidth <= 0) { return }

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

  clear(): void {
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update)
    this.video.removeVideoElement()
    this.video.destroy()
  }
}
