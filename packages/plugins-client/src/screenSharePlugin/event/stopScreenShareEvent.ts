import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * 画面共有が停止した時に発火するイベント
 */
export class StopScreenShare extends CVEvent<IMainScene> {
  public constructor(
    /**
     * 停止された画面共有を配信していたプレイヤーのplayerId
     */
    public readonly sharerId: string
  ) {
    super('stopScreenShare', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    stopScreenShare: StopScreenShare
  }
}
