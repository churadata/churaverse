import { DomManager } from '../../../domManager'
import { DebugDetailScreen } from '../debugDetailScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import { IScreenShareMyStatusDebugDetailScreen } from '../../../../../domain/IRender/IDebugRender/IScreenShareInfoDebugDetailScreen'

export class ScreenShareMyStatusDebugDetailScreen implements IScreenShareMyStatusDebugDetailScreen {
  private content: HTMLElement

  public constructor(settingDialog: DebugDetailScreen) {
    const isOn = 'false'
    const element = `IsOn: ${isOn}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('screenShareInfo', this.content)
  }

  public static build(settingDialog: DebugDetailScreen): ScreenShareMyStatusDebugDetailScreen {
    return new ScreenShareMyStatusDebugDetailScreen(settingDialog)
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
