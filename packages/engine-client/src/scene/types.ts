/* eslint-disable @typescript-eslint/naming-convention */
import type { IMainScene } from './IScene/IMainScene'
import type { ITitleScene } from './IScene/ITitleScene'

export type Scenes = ITitleScene | IMainScene

export interface SceneMap {
  TitleScene: ITitleScene
  MainScene: IMainScene
}

export type SceneName = keyof SceneMap
