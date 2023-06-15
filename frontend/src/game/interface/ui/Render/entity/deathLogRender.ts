import { DamageMessages, IDeathLogRender } from '../../../../domain/IRender/IDeathLogRender'
import { DeathLog } from '../../../../domain/model/deathLog'
import { Interactor } from '../../../../interactor/Interactor'

/**
 * デスログの表示
 */
export class DeathLogRender implements IDeathLogRender {
  public interactor?: Interactor
  private constructor() {}

  public static async build(): Promise<DeathLogRender> {
    return new DeathLogRender()
  }

  /**
   * デスログを追加する
   * @param deathLog 追加したい要素
   */
  public add(deathLog: DeathLog): void {
    const deathMessages: DamageMessages = {
      shark: ` サメの口へ ${deathLog.victim.name} がダイブ！ ${deathLog.killer.name} の勝利！`,
      bomb: ` ${deathLog.victim.name} が死亡！ ${deathLog.killer.name} の爆弾の威力半端ねえぜ！`,
    }

    const message = deathMessages[deathLog.cause]

    this.interactor?.addTextChat('(システム)', message, 'red')
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
