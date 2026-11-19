import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * カメラの有効/無効が完了したときに発火するイベント
 */
export class VideoChatStatusChangedEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('videoChatStatusChanged', true)
  }
}

declare module 'churaverse-engine-client' {
  interface CVMainEventMap {
    videoChatStatusChanged: VideoChatStatusChangedEvent
  }
}
