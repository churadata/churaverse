import { DomManager } from '../../../domManager'
import { ISharkCountDebugDetailScreen } from '../../../../../domain/IRender/IDebugRender/ISharkInfoDebugDetailScreen'
import { DebugDetailScreen } from '../debugDetailScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class SharkCountDebugDetailScreen implements ISharkCountDebugDetailScreen {
  private content: HTMLElement

  public constructor(settingDialog: DebugDetailScreen) {
    const element = `SharkCount: undefined`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('sharkInfo', this.content)
  }

  public static build(settingDialog: DebugDetailScreen): SharkCountDebugDetailScreen {
    return new SharkCountDebugDetailScreen(settingDialog)
  }

  public update(sharkCount: number): void {
    this.content.textContent = `SharkCount: ${sharkCount}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /SharkCount: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
