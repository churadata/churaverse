import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IPlayerIdDebugScreen } from '../../../../../domain/IRender/IDebugRender/IPlayerInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class PlayerIdDebugScreen implements IPlayerIdDebugScreen {
  private content: HTMLElement

  public constructor(Id: string, settingDialog: DebugSummaryScreen) {
    const element = `Id: ${Id}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('playerInfo', this.content)
  }

  public static build(Id: string, settingDialog: DebugSummaryScreen): PlayerIdDebugScreen {
    return new PlayerIdDebugScreen(Id, settingDialog)
  }

  public update(Id: string): void {
    this.content.textContent = `Id:  ${Id}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Id: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
