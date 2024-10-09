/* eslint-disable @typescript-eslint/naming-convention */
import { MainScene } from './main'
import { TitleScene } from './title'
import { SceneMap } from './types'

export const scenes: SceneMap = {
  TitleScene: new TitleScene(),
  MainScene: new MainScene(),
}
