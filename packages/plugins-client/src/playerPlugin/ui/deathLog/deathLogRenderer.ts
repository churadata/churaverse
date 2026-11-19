import type { FadeOutLogRenderer } from '@churaverse/core-ui-plugin-client'
import type { DamageCauseType } from 'churaverse-engine-client'
import type { DeathLogMessageBuilder, IDeathLogRenderer } from '../../interface/IDeathLogRenderer'
import type { DeathLog } from './deathLog'

/**
 * デスログの表示
 */
export class DeathLogRenderer implements IDeathLogRenderer {
  private readonly deathLogMessageBuilders = new Map<DamageCauseType, DeathLogMessageBuilder>()
  public constructor(private readonly fadeOutLogRenderer: FadeOutLogRenderer) {}

  /**
   * デスログを追加する
   */
  public add(deathLog: DeathLog): void {
    const messageBuilder = this.deathLogMessageBuilders.get(deathLog.cause)
    if (messageBuilder !== undefined) {
      this.fadeOutLogRenderer.add(messageBuilder(deathLog))
    } else {
      // killer は PvP の場合 Player、PvE の場合エネミー名の文字列が入るため分岐して名前を取得する
      const killerName = typeof deathLog.killer === 'string' ? deathLog.killer : deathLog.killer.name
      this.fadeOutLogRenderer.add(`${killerName} が ${deathLog.victim.name} に勝利！`)
    }
  }

  /**
   * デスログ作成用の関数を各プラグインから deathLogBuildFuncs に対して追加する関数
   */
  public addDeathLogMessageBuilder(damageCause: DamageCauseType, callback: DeathLogMessageBuilder): void {
    this.deathLogMessageBuilders.set(damageCause, callback)
  }
}
