import { DomManager } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import type { IWorldFpsDebugScreen } from '../../IDebugRenderer/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import type { DebugSummaryScreenContainer } from '../debugSummaryScreenContainer'

export class WorldFpsDebugScreen implements IWorldFpsDebugScreen {
  private content: HTMLElement
  private readonly scene: Scene

  public constructor(scene: Scene, debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    this.scene = scene
    const fps = scene.game.loop.actualFps
    const deltaMs = this.scene.game.loop.delta.toFixed(1)
    const element = `${fps}fps (${deltaMs}ms) `
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugSummaryScreenContainer.addContent('worldInfo', this.content)
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
