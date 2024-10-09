import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IWorldNameDebugScreen } from '../../../../../domain/IRender/IDebugRender/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class WorldNameDebugScreen implements IWorldNameDebugScreen {
  private content: HTMLElement

  public constructor(name: string, settingDialog: DebugSummaryScreen) {
    const element = `Name: ${name}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('worldInfo', this.content)
  }

  public static build(name: string, settingDialog: DebugSummaryScreen): WorldNameDebugScreen {
    return new WorldNameDebugScreen(name, settingDialog)
  }

  public update(name: string): void {
    this.content.textContent = `Name: ${name}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Name: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
