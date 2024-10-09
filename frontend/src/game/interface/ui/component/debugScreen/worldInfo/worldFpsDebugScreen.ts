import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IWorldFpsDebugScreen } from '../../../../../domain/IRender/IDebugRender/IWorldInfoDebugScreen'
import { Scene } from 'phaser'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class WorldFpsDebugScreen implements IWorldFpsDebugScreen {
  private content: HTMLElement
  private readonly scene: Scene

  public constructor(scene: Scene, settingDialog: DebugSummaryScreen) {
    this.scene = scene
    const fps = scene.game.loop.actualFps
    const deltaMs = this.scene.game.loop.delta.toFixed(1)
    const element = `${fps}fps (${deltaMs}ms) `
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('worldInfo', this.content)
  }

  public static build(scene: Scene, settingDialog: DebugSummaryScreen): WorldFpsDebugScreen {
    return new WorldFpsDebugScreen(scene, settingDialog)
  }

  public update(): void {
    const fps = this.scene.game.loop.actualFps.toFixed(1)
    const deltaMs = this.scene.game.loop.delta.toFixed(1)
    this.content.textContent = `${fps}fps (${deltaMs}ms) `
  }

  public dump(): string {
    const dumpElement = this.content.textContent ?? 'undefined'
    return dumpElement
  }
}
