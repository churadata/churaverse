import { Scene } from 'phaser'
import { DamageMessages, IDeathLogRender } from '../../../../domain/IRender/IDeathLogRender'
import { DeathLog } from '../../../../domain/model/deathLog'
import { Interactor } from '../../../../interactor/Interactor'
import { FadeOutLogRender } from './fadeOutLogRender'

/**
 * デスログの表示
 */
export class DeathLogRender implements IDeathLogRender {
  public interactor?: Interactor
  private readonly scene: Scene
  private readonly fadeOutLogRender: FadeOutLogRender

  private constructor(scene: Scene, fadeOutLogRender: FadeOutLogRender) {
    this.scene = scene
    this.fadeOutLogRender = fadeOutLogRender
  }

  public static async build(scene: Scene, fadeOutLogRender: FadeOutLogRender): Promise<DeathLogRender> {
    return new DeathLogRender(scene, fadeOutLogRender)
  }

  /**
   * デスログを追加する
   */
  public add(deathLog: DeathLog): void {
    const deathMessages: DamageMessages = {
      shark: ` サメの口へ ${deathLog.victim.name} がダイブ！ ${deathLog.killer.name} の勝利！`,
      bomb: ` ${deathLog.victim.name} が死亡！ ${deathLog.killer.name} の爆弾の威力半端ねえぜ！`,
    }

    const message = deathMessages[deathLog.cause]

    this.fadeOutLogRender.add(message)
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
