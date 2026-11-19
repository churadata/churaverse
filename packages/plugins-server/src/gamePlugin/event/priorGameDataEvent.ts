import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 * プレイヤーが入室した際に発火されるイベント
 * 進行中のゲームがないかを確認するために使用
 */
export class PriorGameDataEvent extends CVEvent<IMainScene> {
  public constructor(public readonly senderId: string) {
    super('priorGameData', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    priorGameData: PriorGameDataEvent
  }
}
