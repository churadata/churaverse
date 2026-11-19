import { DomManager } from '../../../domManager'
import { IBombCountDebugDetailScreen } from '../../../../../domain/IRender/IDebugRender/ISharkInfoDebugDetailScreen'
import { DebugDetailScreen } from '../debugDetailScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class BombCountDebugDetailScreen implements IBombCountDebugDetailScreen {
  private content: HTMLElement

  public constructor(settingDialog: DebugDetailScreen) {
    const element = `BombCount: undefined`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('bombInfo', this.content)
  }

  public static build(settingDialog: DebugDetailScreen): BombCountDebugDetailScreen {
    return new BombCountDebugDetailScreen(settingDialog)
  }

  public update(bombCount: number): void {
    this.content.textContent = `BombCount: ${bombCount}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /BombCount: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
