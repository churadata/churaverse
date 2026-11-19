// eslint-disable-next-line filename-rules/match

import type { IMainScene, Store } from 'churaverse-engine-client'
import {
  type Participant,
  type RemoteParticipant,
  type RemoteTrackPublication,
  type Room,
  RoomEvent,
  Track,
  type TrackPublication,
} from 'livekit-client'
import type { IWebCameraIdDebugDetailScreen } from './debugScreen/IDebugScreen/IWebCameraInfoDebugScreen'
import '@churaverse/popup-screen-list-plugin-client'

export class VideoReceiver {
  public constructor(
    private readonly room: Room,
    private readonly store: Store<IMainScene>,
    private readonly webCameraIdDebugDetailScreen: IWebCameraIdDebugDetailScreen
  ) {
    this.room
      .on(RoomEvent.TrackSubscribed, this.onStartStream.bind(this))
      .on(RoomEvent.TrackUnsubscribed, this.onStopStream.bind(this))
      .on(RoomEvent.TrackMuted, this.muteStream.bind(this))
      .on(RoomEvent.TrackUnmuted, this.unMuteStream.bind(this))
  }

  private displayVideoTrack(publication: TrackPublication, participant: Participant): void {
    if (publication.isMuted) return
    const remoteTrackVideoElement = publication.videoTrack?.attach() as HTMLVideoElement
    if (remoteTrackVideoElement == null) return

    this.store.of('popUpScreenList').addScreen(participant.identity, remoteTrackVideoElement)
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    if (ownPlayerId === participant.identity) return
    this.webCameraIdDebugDetailScreen.update(participant.identity)
  }

  private onStartStream(_track: Track, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (publication.source !== Track.Source.Camera) return
    this.displayVideoTrack(publication, participant)
  }

  private unMuteStream(publication: TrackPublication, participant: Participant): void {
    if (publication.source !== Track.Source.Camera) return
    this.displayVideoTrack(publication, participant)
  }

  private muteStream(publication: TrackPublication, participant: Participant): void {
    if (publication.source !== Track.Source.Camera) return
    this.store.of('popUpScreenList').removeScreen(participant.identity)
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    if (ownPlayerId === participant.identity) return
    this.webCameraIdDebugDetailScreen.update(participant.identity)
  }

  private onStopStream(track: Track, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (publication.source !== Track.Source.Camera) return
    this.store.of('popUpScreenList').removeScreen(participant.identity)
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    if (ownPlayerId === participant.identity) return
    if (track.isMuted) return
    this.webCameraIdDebugDetailScreen.update(participant.identity)
  }
}
