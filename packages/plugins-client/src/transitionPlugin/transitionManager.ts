import type { CVEvent, IEventBus, SceneName, Scenes } from 'churaverse-engine-client'
import { WillSceneTransitionEvent } from './event/willSceneTransitionEvent'
import type { ISceneTransitionDataTransporter } from './interface/ISceneTransitionDataTransporter'
import type { ITransitionManager } from './interface/ITransitionManager'
import type { SceneTransitionData } from './sceneTransitionData/sceneTransitionData'

/**
 * 画面遷移をコントロールするクラス
 */
export class TransitionManager<CurrentScene extends Scenes> implements ITransitionManager<CurrentScene> {
  public constructor(
    private readonly currentSceneName: CurrentScene['sceneName'],
    private readonly sceneDataTransporter: ISceneTransitionDataTransporter<CurrentScene>,
    private readonly scene: Phaser.Scenes.ScenePlugin,
    private readonly eventBus: IEventBus<Scenes>
  ) {}

  private static receivedData?: any = undefined

  public transitionTo(dest: SceneName): void {
    this.eventBus.post(
      new WillSceneTransitionEvent(this.currentSceneName, dest, this.sceneDataTransporter) as CVEvent<Scenes>
    )
  }

  /**
   * phaserのscene.startで実際に画面遷移を行う. WillSceneTransitionEventがpostされた際にtransitionPluginが内部で実行する
   */
  public transitionByPhaserScene<DestScene extends Scenes>(
    dest: SceneName,
    sendData?: SceneTransitionData<CurrentScene, DestScene>
  ): void {
    TransitionManager.receivedData = sendData
    this.scene.start(dest)
  }

  public getReceivedData<PrevScene extends Scenes>(): SceneTransitionData<PrevScene, CurrentScene> {
    return TransitionManager.receivedData
  }
}
