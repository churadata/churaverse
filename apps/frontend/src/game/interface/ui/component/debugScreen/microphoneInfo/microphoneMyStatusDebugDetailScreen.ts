import { DomManager } from '../../../domManager'
import { DebugDetailScreen } from '../debugDetailScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import { IMicrophoneMyStatusDebugDetailScreen } from '../../../../../domain/IRender/IDebugRender/IMicrophoneInfoDebugDetailScreen'

export class MicrophoneStatusDebugDetailScreen implements IMicrophoneMyStatusDebugDetailScreen {
  private content: HTMLElement

  public constructor(settingDialog: DebugDetailScreen) {
    const isOn = 'false'
    const element = `IsOn: ${isOn}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('microphoneInfo', this.content)
  }

  public static build(settingDialog: DebugDetailScreen): MicrophoneStatusDebugDetailScreen {
    return new MicrophoneStatusDebugDetailScreen(settingDialog)
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
