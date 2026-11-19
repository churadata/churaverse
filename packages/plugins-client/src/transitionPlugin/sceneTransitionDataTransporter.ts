import type { Scenes } from 'churaverse-engine-client'
import type { ISceneTransitionDataTransporter } from './interface/ISceneTransitionDataTransporter'
import type { SceneTransitionData } from './sceneTransitionData/sceneTransitionData'

export class SceneTransitionDataTransporter<CurrentScene extends Scenes>
  implements ISceneTransitionDataTransporter<CurrentScene>
{
  private sendData: Map<string, any> = new Map()

  public push<To extends Scenes, Key extends keyof SceneTransitionData<CurrentScene, To>>(
    key: Key & string,
    data: SceneTransitionData<CurrentScene, To>[Key]
  ): void {
    this.sendData.set(key, data)
  }

  public popData<To extends Scenes>(): SceneTransitionData<CurrentScene, To> {
    const data = Object.fromEntries(this.sendData) as SceneTransitionData<CurrentScene, To>
    this.sendData = new Map()
    return data
  }
}
