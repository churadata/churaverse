import { CVEvent, type IMainScene, type Position } from 'churaverse-engine-server'

/**
 * ゲーム中断時のイベント
 * @param playerId ゲームを中断したプレイヤーid
 */
export class BossAttackRequestEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly bossId: string,
    public readonly position: Position
  ) {
    super('bossAttackRequest', false)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    bossAttackRequest: BossAttackRequestEvent
  }
}
