/* eslint-disable @typescript-eslint/naming-convention */
import { IMainScene } from './IScene/IMainScene'
import { ITitleScene } from './IScene/ITitleScene'

export interface SceneMap {
  TitleScene: ITitleScene
  MainScene: IMainScene
}

export type Scenes = SceneMap[keyof SceneMap]
export type SceneName = keyof SceneMap
