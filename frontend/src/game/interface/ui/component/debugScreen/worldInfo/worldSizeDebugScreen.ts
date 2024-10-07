import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IWorldSizeDebugScreen } from '../../../../../domain/IRender/IDebugRender/IWorldInfoDebugScreen'
import { Scene } from 'phaser'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class WorldSizeDebugScreen implements IWorldSizeDebugScreen {
  private content: HTMLElement
  private gridSizeContent: HTMLElement
  private readonly scene: Scene

  public constructor(scene: Scene, settingDialog: DebugSummaryScreen) {
    this.scene = scene
    const element = 'Map data not found'
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    this.gridSizeContent = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('worldInfo', this.content)
    settingDialog.addContent('worldInfo', this.gridSizeContent)
  }

  public static build(scene: Scene, settingDialog: DebugSummaryScreen): WorldSizeDebugScreen {
    return new WorldSizeDebugScreen(scene, settingDialog)
  }

  public update(map: Phaser.Tilemaps.Tilemap): void {
    this.content.textContent = `Width: ${map.widthInPixels}, Height: ${map.heightInPixels}`
    this.gridSizeContent.textContent = `GridWidth: ${map.width}, GridHeight: ${map.height}`
  }

  public dump(): string {
    const dumpElementContent = this.content.textContent ?? 'undefined'
    const dumpGridContent = this.gridSizeContent.textContent ?? 'undefined'
    return `worldSize: ${dumpElementContent} ${dumpGridContent}`
  }
}
