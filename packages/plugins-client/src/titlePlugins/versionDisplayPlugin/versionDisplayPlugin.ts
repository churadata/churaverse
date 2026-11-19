import { BasePlugin, type ITitleScene, type PhaserSceneInit, type StartEvent } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import { VersionDisplayRenderer } from './renderer/versionDisplayRenderer'

export class VersionDisplayPlugin extends BasePlugin<ITitleScene> {
  private scene!: Scene

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))

    this.bus.subscribeEvent('start', this.start.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private start(_ev: StartEvent): void {
    void new VersionDisplayRenderer(this.scene)
  }
}
