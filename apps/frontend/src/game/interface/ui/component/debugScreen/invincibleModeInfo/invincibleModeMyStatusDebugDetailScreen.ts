import { DomManager } from '../../../domManager'
import { DebugDetailScreen } from '../debugDetailScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import { IInvincibilityMyStatusDebugDetailScreen } from '../../../../../domain/IRender/IDebugRender/IInvincibleModeInfoDebugDetailScreen'

export class InvincibleModeMyStatusDebugDetailScreen implements IInvincibilityMyStatusDebugDetailScreen {
  private content: HTMLElement

  public constructor(settingDialog: DebugDetailScreen) {
    const isOn: string = 'true'
    const element = `IsOn: ${isOn}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('invincibleModeInfo', this.content)
  }

  public static build(settingDialog: DebugDetailScreen): InvincibleModeMyStatusDebugDetailScreen {
    return new InvincibleModeMyStatusDebugDetailScreen(settingDialog)
  }

  public update(isOn: boolean): void {
    this.content.textContent = `IsOn: ${String(isOn)}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /IsOn: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
