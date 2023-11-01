import { Scene } from 'phaser'
import { IJoinLeaveLogRender } from '../../../../domain/IRender/IJoinLeaveLogRender'
import { Interactor } from '../../../../interactor/Interactor'
import { FadeOutLogRender } from './fadeOutLogRender'

/**
 * 入退室のログを表示
 */
export class JoinLeaveLogRender implements IJoinLeaveLogRender {
  public interactor?: Interactor
  private readonly scene: Scene
  private readonly fadeOutLogRender: FadeOutLogRender

  private constructor(scene: Scene, fadeOutLogRender: FadeOutLogRender) {
    this.scene = scene
    this.fadeOutLogRender = fadeOutLogRender
  }

  public static async build(scene: Scene, fadeOutLogRender: FadeOutLogRender): Promise<JoinLeaveLogRender> {
    return new JoinLeaveLogRender(scene, fadeOutLogRender)
  }

  /**
   * @param id を元にランダムにmessage決めてる
   */

  public join(id: string, name: string): void {
    const entryMessages = [`${name} が現れた...!`, `${name} 降臨！`, `${name} in!`]

    const message = entryMessages[id.charCodeAt(0) % entryMessages.length]
    this.fadeOutLogRender.add(message)
  }

  public leave(id: string, name: string): void {
    const exitMessages = [`${name} に逃げられた...!`, `さらば ${name} また会う日まで...!!`, `${name} out!`]

    const message = exitMessages[id.charCodeAt(0) % exitMessages.length]
    this.fadeOutLogRender.add(message)
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
