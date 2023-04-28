import { ITransitionManager, SceneName } from '../../interactor/ITransitionManager'

/**
 * 画面遷移をコントロールするクラス
 */
export class TransitionManager<ReceiveTransitionData = undefined, SendTransitionData = undefined>
  implements ITransitionManager<ReceiveTransitionData, SendTransitionData>
{
  public constructor(private readonly scene: Phaser.Scenes.ScenePlugin) {}
  private static receivedData?: any = undefined

  public transitionTo(dest: SceneName, sendData?: SendTransitionData): void {
    TransitionManager.receivedData = sendData
    this.scene.start(dest)
  }

  public getReceivedData(): ReceiveTransitionData {
    return TransitionManager.receivedData
  }
}
