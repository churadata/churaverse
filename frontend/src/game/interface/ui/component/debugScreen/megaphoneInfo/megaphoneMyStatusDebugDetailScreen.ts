import { DomManager } from '../../../domManager'
import { DebugDetailScreen } from '../debugDetailScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import { IMegaphoneMyStatusDebugDetailScreen } from '../../../../../domain/IRender/IDebugRender/IMegaphoneInfoDebugDetailScreen'

export class MegaphoneStatusDebugDetailScreen implements IMegaphoneMyStatusDebugDetailScreen {
  private content: HTMLElement

  public constructor(settingDialog: DebugDetailScreen) {
    const isOn = 'false'
    const element = `IsOn: ${isOn}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('megaphoneInfo', this.content)
  }

  public static build(settingDialog: DebugDetailScreen): MegaphoneStatusDebugDetailScreen {
    return new MegaphoneStatusDebugDetailScreen(settingDialog)
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
