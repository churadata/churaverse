import { BasePlugin, EVENT_PRIORITY, type InitEvent, type PhaserSceneInit, type Scenes } from 'churaverse-engine-client'
import { TransitionManagerUndefinedError } from './errors/transitionManagerUndefinedError'
import type { WillSceneTransitionEvent } from './event/willSceneTransitionEvent'
import { SceneTransitionDataTransporter } from './sceneTransitionDataTransporter'
import { initTransitionPluginStore } from './store/initTransitionPluginStore'
import { TransitionManager } from './transitionManager'

export class TransitionPlugin extends BasePlugin<Scenes> {
  private transitionMgr?: TransitionManager<Scenes>
  private readonly sceneDataTransporter = new SceneTransitionDataTransporter()

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.bus.subscribeEvent('willSceneTransition', this.onSceneTransition.bind(this), EVENT_PRIORITY.LOWEST)
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.transitionMgr = new TransitionManager<Scenes>(
      ev.scene.sceneName,
      this.sceneDataTransporter,
      ev.scene.scene,
      this.bus
    )
  }

  private init(_ev: InitEvent): void {
    if (this.transitionMgr === undefined) throw new TransitionManagerUndefinedError()

    initTransitionPluginStore(this.store, this.transitionMgr)
  }

  private onSceneTransition(ev: WillSceneTransitionEvent<Scenes, Scenes>): void {
    if (this.transitionMgr === undefined) throw new TransitionManagerUndefinedError()

    this.transitionMgr.transitionByPhaserScene(ev.to, this.sceneDataTransporter.popData())
  }
}
