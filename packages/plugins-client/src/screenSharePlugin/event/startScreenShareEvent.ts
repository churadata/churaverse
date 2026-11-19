import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * 画面共有が開始された時に発火するイベント
 */
export class StartScreenShare extends CVEvent<IMainScene> {
  public constructor(
    /**
     * 画面共有を開始したプレイヤーのplayerId
     */
    public readonly sharerId: string,
    /**
     * 共有されている映像
     */
    public readonly video: HTMLVideoElement
  ) {
    super('startScreenShare', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    startScreenShare: StartScreenShare
  }
}
