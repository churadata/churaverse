import { Scene } from 'phaser'
import { SocketListenSceneName } from './ISocket'

/**
 * socketのコールバックを発火するSceneを判断する
 */
export class CallbackExecutionGuard {
  public constructor(private readonly scene: Scene) {}

  /**
   * 引数で指定したシーン名が現在のシーンの名前ならtrueを返す
   */
  public isCurrentScene(sceneName: SocketListenSceneName = 'Main'): boolean {
    if (sceneName === 'Universal') {
      return true
    }
    return this.scene.scene.isActive(sceneName)
  }
}
