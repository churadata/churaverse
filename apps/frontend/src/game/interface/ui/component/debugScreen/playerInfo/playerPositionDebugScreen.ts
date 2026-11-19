import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { Position } from '../../../../../domain/model/core/position'
import { IPlayerPositionDebugScreen } from '../../../../../domain/IRender/IDebugRender/IPlayerInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class PlayerPositionDebugScreen implements IPlayerPositionDebugScreen {
  private readonly positionContent: HTMLElement
  private readonly positionGridContent: HTMLElement

  public constructor(position: Position, settingDialog: DebugSummaryScreen) {
    const positionElement = `X: ${position.x.toFixed(0)}, Y: ${position.y.toFixed(0)}`
    const positionGridElement = `GridX: ${position.gridX}, GridY: ${position.gridY}`

    this.positionContent = DomManager.jsxToDom(ElementDebugScreenComponent({ element: positionElement }))
    this.positionGridContent = DomManager.jsxToDom(ElementDebugScreenComponent({ element: positionGridElement }))
    settingDialog.addContent('playerInfo', this.positionContent)
    settingDialog.addContent('playerInfo', this.positionGridContent)
  }

  public static build(position: Position, settingDialog: DebugSummaryScreen): PlayerPositionDebugScreen {
    return new PlayerPositionDebugScreen(position, settingDialog)
  }

  public update(position: Position): void {
    this.positionContent.textContent = `X: ${position.x.toFixed(0)}, Y: ${position.y.toFixed(0)}`
    this.positionGridContent.textContent = `GridX: ${position.gridX}, GridY: ${position.gridY}`
  }

  public dump(): string {
    const dumpElementContent = this.positionContent.textContent ?? 'undefined'
    const dumpGridContent = this.positionGridContent.textContent ?? 'undefined'

    return `Position: ${dumpElementContent} ${dumpGridContent}`
  }
}
