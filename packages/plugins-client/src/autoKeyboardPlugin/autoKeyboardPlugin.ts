import { BasePlugin, type PhaserSceneInit, type Scenes, SceneUndefinedError } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import { AutoKeyFactory } from './autoKeyFactory'
// keyboardPluginのStoreInMain/StoreInTitle拡張(declare module)を読み込むためだけのimport。値としては使用しない
import '@churaverse/keyboard-plugin-client'

export class AutoKeyBoardPlugin extends BasePlugin<Scenes> {
  private scene?: Scene

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(): void {
    if (this.scene === undefined) throw new SceneUndefinedError()

    const keyFactory = new AutoKeyFactory(this.scene)
    this.store.of('keyboardPlugin').keyFactorySetter.set(keyFactory)
  }
}
