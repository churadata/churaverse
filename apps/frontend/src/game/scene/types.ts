/* eslint-disable @typescript-eslint/naming-convention */
import { IMainScene } from './IScene/IMainScene'
import { ITitleScene } from './IScene/ITitleScene'

export type Scenes = ITitleScene | IMainScene

export interface SceneMap {
  TitleScene: ITitleScene
  MainScene: IMainScene
}

export type SceneName = keyof SceneMap
