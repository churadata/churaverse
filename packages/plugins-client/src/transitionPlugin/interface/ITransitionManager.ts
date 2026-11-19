import type { SceneName, Scenes } from 'churaverse-engine-client'
import type { SceneTransitionData } from '../sceneTransitionData/sceneTransitionData'

/**
 * 外部プラグインから画面遷移をコントロールするためのinterface
 */
export interface ITransitionManager<CurrentScene extends Scenes> {
  /**
   * 画面遷移する
   * @param dest 遷移先のScene名
   */
  transitionTo: (dest: SceneName) => void

  /**
   * 遷移元のSceneから渡されたデータを取得する
   */
  getReceivedData: <PrevScene extends Scenes>() => SceneTransitionData<PrevScene, CurrentScene>
}
