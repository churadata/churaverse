import {
  LocalParticipant,
  LocalTrackPublication,
  Room,
  RoomEvent,
  ScreenShareCaptureOptions,
  Track,
} from 'livekit-client'
import { IScreenShareSender } from '../../interactor/screenShare/IScreenShareSender'
import { SharedScreenRender } from '../ui/Render/entity/sharedScreenRender'
import { Scene } from 'phaser'
import { Interactor } from '../../interactor/Interactor'

export class ScreenShareSender implements IScreenShareSender {
  private interactor?: Interactor

  public constructor(private readonly scene: Scene, private readonly room: Room) {
    this.room
      .on(RoomEvent.LocalTrackPublished, this.onStartStream.bind(this))
      .on(RoomEvent.LocalTrackUnpublished, this.onStopStream.bind(this))
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * 自プレイヤーの画面共有を開始した時に実行される
   */
  private onStartStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    const remoteTrackPublication = participant.getTrack(Track.Source.ScreenShare)
    if (remoteTrackPublication?.videoTrack == null || remoteTrackPublication.track == null) {
      return
    }

    const mediaStream = new MediaStream()
    mediaStream.addTrack(remoteTrackPublication.videoTrack.mediaStreamTrack)

    void SharedScreenRender.build(this.scene, mediaStream).then((sharedScreenRender) => {
      this.interactor?.joinScreenShare(participant.identity, sharedScreenRender)
    })
  }

  /**
   * 自プレイヤーの画面共有を停止した時に実行される
   */
  private onStopStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    this.interactor?.leaveScreenShare(participant.identity)
  }

  public async startStream(): Promise<boolean> {
    try {
      const screenShareCaptureOptions: ScreenShareCaptureOptions = { resolution: { width: 1280, height: 720 } }
      await this.room.localParticipant.setScreenShareEnabled(true, screenShareCaptureOptions)
    } catch (error) {
      // 共有画面の選択時にキャンセルした場合
      // console.log(error)
      return false
    }
    return this.room.localParticipant.isScreenShareEnabled
  }

  public async stopStream(): Promise<boolean> {
    await this.room.localParticipant.setScreenShareEnabled(false)

    // 終了失敗=isScreenShareEnabledがtrueの時なので, isScreenShareEnabledの否定を返す
    return !this.room.localParticipant.isScreenShareEnabled
  }
}
