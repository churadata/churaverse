import type { Scenes } from 'churaverse-engine-client'
import type { SceneTransitionData } from '../sceneTransitionData/sceneTransitionData'

export interface ISceneTransitionDataTransporter<CurrentScene extends Scenes> {
  /**
   * 遷移先に渡すデータを追加する
   */
  push: <DestScene extends Scenes, Key extends keyof SceneTransitionData<CurrentScene, DestScene>>(
    key: Key & string,
    data: SceneTransitionData<CurrentScene, DestScene>[Key]
  ) => void
}
