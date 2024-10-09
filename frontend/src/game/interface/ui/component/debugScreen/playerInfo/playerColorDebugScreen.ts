import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IPlayerColorDebugScreen } from '../../../../../domain/IRender/IDebugRender/IPlayerInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class PlayerColorDebugScreen implements IPlayerColorDebugScreen {
  private content: HTMLElement

  public constructor(color: string, settingDialog: DebugSummaryScreen) {
    const element = `Color: ${color}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('playerInfo', this.content)
  }

  public static build(color: string, settingDialog: DebugSummaryScreen): PlayerColorDebugScreen {
    return new PlayerColorDebugScreen(color, settingDialog)
  }

  public update(Id: string): void {
    this.content.textContent = `Color: ${Id}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Color: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
