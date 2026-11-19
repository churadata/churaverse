import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IPlayerCountInWorld } from '../../../../../domain/IRender/IDebugRender/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class PlayerCountInWorld implements IPlayerCountInWorld {
  private content: HTMLElement

  public constructor(settingDialog: DebugSummaryScreen) {
    const element = `PlayerCount: undefined`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('worldInfo', this.content)
  }

  public static build(settingDialog: DebugSummaryScreen): PlayerCountInWorld {
    return new PlayerCountInWorld(settingDialog)
  }

  public update(playerCount: number): void {
    this.content.textContent = `PlayerCount: ${playerCount}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /PlayerCount: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
