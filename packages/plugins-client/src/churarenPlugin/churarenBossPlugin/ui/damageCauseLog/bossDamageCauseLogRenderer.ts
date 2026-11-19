import type { FadeOutLogRenderer } from '@churaverse/core-ui-plugin-client'
import type { DamageCauseType } from 'churaverse-engine-client'
import type {
  BossDamageCauseLogMessageBuilder,
  IBossDamageCauseLogRenderer,
} from '../../interface/IBossDamageCauseLogRenderer'
import type { BossDamageCauseLog } from './bossDamageCauseLog'

/**
 * ダメージ原因ログの表示
 */
export class BossDamageCauseLogRenderer implements IBossDamageCauseLogRenderer {
  private readonly damageCauseLogMessageBuilders = new Map<DamageCauseType, BossDamageCauseLogMessageBuilder>()
  public constructor(private readonly fadeOutLogRenderer: FadeOutLogRenderer) {}

  /**
   * ダメージ原因ログを追加する
   */
  public add(damageCauseLog: BossDamageCauseLog): void {
    const messageBuilder = this.damageCauseLogMessageBuilders.get(damageCauseLog.cause)
    if (messageBuilder !== undefined) {
      this.fadeOutLogRenderer.add(messageBuilder(damageCauseLog))
    } else {
      this.fadeOutLogRenderer.add(
        `${damageCauseLog.attacker.name} が ボス に ${damageCauseLog.damage} ダメージを与えた！`
      )
    }
  }

  /**
   * ダメージ原因ログ作成用の関数を各プラグインから damageCauseLogBuildFuncs に対して追加する関数
   */
  public addDamageCauseLogMessageBuilder(
    damageCause: DamageCauseType,
    callback: BossDamageCauseLogMessageBuilder
  ): void {
    this.damageCauseLogMessageBuilders.set(damageCause, callback)
  }
}
