import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IPlayerDirectionDebugScreen } from '../../../../../domain/IRender/IDebugRender/IPlayerInfoDebugScreen'
import { Direction, vectorToName } from '../../../../../domain/model/core/direction'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class PlayerDirectionDebugScreen implements IPlayerDirectionDebugScreen {
  private content: HTMLElement

  public constructor(direction: Direction, settingDialog: DebugSummaryScreen) {
    const element = `Direction: ${vectorToName(direction)}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('playerInfo', this.content)
  }

  public static build(direction: Direction, settingDialog: DebugSummaryScreen): PlayerDirectionDebugScreen {
    return new PlayerDirectionDebugScreen(direction, settingDialog)
  }

  public update(direction: Direction): void {
    this.content.textContent = `Direction: ${vectorToName(direction)}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Direction: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
