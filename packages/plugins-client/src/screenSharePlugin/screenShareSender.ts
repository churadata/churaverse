import type { IEventBus, IMainScene } from 'churaverse-engine-client'
import {
  type LocalParticipant,
  type LocalTrackPublication,
  type Room,
  RoomEvent,
  type ScreenShareCaptureOptions,
  Track,
} from 'livekit-client'
import { StartScreenShare } from './event/startScreenShareEvent'
import { StopScreenShare } from './event/stopScreenShareEvent'
import type { IScreenShareSender } from './interface/IScreenShareSender'

export class ScreenShareSender implements IScreenShareSender {
  public constructor(
    private readonly room: Room,
    private readonly eventBus: IEventBus<IMainScene>
  ) {
    this.room
      .on(RoomEvent.LocalTrackPublished, this.onStartStream.bind(this))
      .on(RoomEvent.LocalTrackUnpublished, this.onStopStream.bind(this))
  }

  /**
   * 自プレイヤーの画面共有を開始した時に実行される
   */
  private onStartStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    if (publication.source !== Track.Source.ScreenShare) return
    const track = participant.getTrackPublication(Track.Source.ScreenShare)?.track
    if (track?.mediaStreamTrack === undefined) return

    const mediaStream = new MediaStream()
    mediaStream.addTrack(track.mediaStreamTrack)

    const video = document.createElement('video')
    video.srcObject = mediaStream
    this.eventBus.post(new StartScreenShare(participant.identity, video))
  }

  /**
   * 自プレイヤーの画面共有を停止した時に実行される
   */
  private onStopStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    if (publication.source !== Track.Source.ScreenShare) return
    this.eventBus.post(new StopScreenShare(participant.identity))
  }

  public async startStream(): Promise<boolean> {
    if (this.alreadyOthersScreenShared()) {
      const warnMsg =
        '他のユーザーが画面共有中です。新しく共有を開始すると、他のユーザーの共有は終了します。よろしいですか？'
      const cancelScreenShare = !window.confirm(warnMsg)
      if (cancelScreenShare) return false
    }

    try {
      const screenShareCaptureOptions: ScreenShareCaptureOptions = { resolution: { width: 1280, height: 720 } }
      await this.room.localParticipant.setScreenShareEnabled(true, screenShareCaptureOptions)
    } catch (_error) {
      // 共有画面の選択時にキャンセルした場合
      return false
    }
    return this.room.localParticipant.isScreenShareEnabled
  }

  public async stopStream(): Promise<boolean> {
    await this.room.localParticipant.setScreenShareEnabled(false)

    // 終了失敗=isScreenShareEnabledがtrueの時なので, isScreenShareEnabledの否定を返す
    return !this.room.localParticipant.isScreenShareEnabled
  }

  /**
   * 既に他プレイヤーが画面共有している場合true
   */
  private alreadyOthersScreenShared(): boolean {
    const participants = Array.from(this.room.remoteParticipants.values() as Iterable<LocalParticipant>)

    return participants.some((participant) => {
      return participant.isScreenShareEnabled
    })
  }
}
