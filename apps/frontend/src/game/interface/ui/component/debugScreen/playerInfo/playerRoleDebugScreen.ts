import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IPlayerRoleDebugScreen } from '../../../../../domain/IRender/IDebugRender/IPlayerInfoDebugScreen'
import { PlayerRoleName } from '../../../../../domain/model/types'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class PlayerRoleDebugScreen implements IPlayerRoleDebugScreen {
  private content: HTMLElement

  public constructor(role: PlayerRoleName, settingDialog: DebugSummaryScreen) {
    const element = `Role: ${role}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('playerInfo', this.content)
  }

  public static build(role: PlayerRoleName, settingDialog: DebugSummaryScreen): PlayerRoleDebugScreen {
    return new PlayerRoleDebugScreen(role, settingDialog)
  }

  public update(Id: string): void {
    this.content.textContent = `Role: ${Id}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Role: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
