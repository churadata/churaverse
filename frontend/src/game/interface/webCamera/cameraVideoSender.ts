import {
  LocalParticipant,
  LocalTrackPublication,
  Room,
  RoomEvent,
  Track,
  VideoCaptureOptions,
  TrackProcessor,
} from 'livekit-client'
import { Dummy } from '@livekit/track-processors'
import { Scene } from 'phaser'
import { Interactor } from '../../interactor/Interactor'
import { ICameraVideoSender } from '../../interactor/webCamera/ICameraVideoSender'
import { CameraEffectManager } from './cameraEffectManager'

export class CameraVideoSender implements ICameraVideoSender {
  private interactor?: Interactor
  private currentEffect?: TrackProcessor<Track.Kind>
  private readonly cameraEffectManager: CameraEffectManager

  public constructor(private readonly scene: Scene, private readonly room: Room) {
    this.room
      .on(RoomEvent.LocalTrackPublished, this.onStartStream.bind(this))
      .on(RoomEvent.LocalTrackUnpublished, this.onStopStream.bind(this))
    this.cameraEffectManager = new CameraEffectManager()
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * 自プレイヤーのカメラを開始した時に実行される
   */
  private onStartStream(publication: LocalTrackPublication, participant: LocalParticipant): void {}

  /**
   * 通信切断時に実行される
   */
  private onStopStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    if (publication.source !== Track.Source.Camera) return
    this.interactor?.leaveCameraVideo(participant.identity)
  }

  /**
   * 引数のStreamの映像にエフェクトを適用する
   * @param cameraStream エフェクトを掛ける対象。
   */
  private async changeEffect(cameraStream: LocalTrackPublication): Promise<LocalTrackPublication> {
    if (cameraStream?.videoTrack == null || cameraStream.track == null) {
      return cameraStream
    }
    if (this.currentEffect == null) {
      this.currentEffect = Dummy()
    }

    // エフェクトを適用
    await cameraStream.videoTrack.setProcessor(this.currentEffect)

    return cameraStream
  }

  /**
   * interactorから呼び出す関数
   * エフェクトのモード/画像の切替時に呼び出される。
   * @param mode
   */
  public async setEffect(mode: string): Promise<void> {
    if (this.room.localParticipant.isCameraEnabled) {
      // Restart Streamでエフェクトを再適用
      await this.startStream()
    }
    if (this.cameraEffectManager != null) {
      this.currentEffect = this.cameraEffectManager.setEffecter(mode)
    }
  }

  /**
   * 実際にカメラ映像を取得し, エフェクトを適用する。
   * 適用した映像はmediaStreamとして返す。
   * @returns mediaStream
   */
  private async applyEffect(): Promise<MediaStream | undefined> {
    const cameraStream = this.room.localParticipant.getTrack(Track.Source.Camera)
    if (cameraStream?.videoTrack == null || cameraStream.track == null) {
      return undefined
    }
    // cameraStream.videoTrack.codec = 'vp9'
    this.currentEffect = this.cameraEffectManager?.getEffecter()
    await this.changeEffect(cameraStream)

    // Return Camera Stream
    const mediaStream = new MediaStream()
    mediaStream.addTrack(cameraStream.videoTrack.mediaStreamTrack)
    return mediaStream
  }

  /**
   * カメラ映像を有効にし、エフェクトを適用した映像のストリーミングを開始する。
   * @returns
   */
  public async startStream(): Promise<boolean> {
    const videoCaptureOptions: VideoCaptureOptions = { resolution: { width: 720, height: 480, frameRate: 30 } }
    await this.room.localParticipant.setCameraEnabled(true, videoCaptureOptions)
    const stream = await this.applyEffect()
    if (stream != null) {
      this.interactor?.joinCameraVideo(this.room.localParticipant.identity, stream)
    } else {
      await this.room.localParticipant.setCameraEnabled(false)
    }
    return this.room.localParticipant.isCameraEnabled
  }

  public async stopStream(): Promise<boolean> {
    await this.room.localParticipant.setCameraEnabled(false)
    this.interactor?.leaveCameraVideo(this.room.localParticipant.identity)
    // 終了失敗=isCameraEnabledがtrueの時なので, isCameraEnabledの否定を返す
    return !this.room.localParticipant.isCameraEnabled
  }
}
