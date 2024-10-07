import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IWorldFrontendVersionDebugScreen } from '../../../../../domain/IRender/IDebugRender/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class WorldFrontendVersionDebugScreen implements IWorldFrontendVersionDebugScreen {
  private content: HTMLElement

  public constructor(settingDialog: DebugSummaryScreen) {
    const element =
      `Frontend Version: ${import.meta.env.VITE_FRONT_VERSION}` ?? 'Frontend Version: Versionの取得ができませんでした。'
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('worldInfo', this.content)
  }

  public static build(settingDialog: DebugSummaryScreen): WorldFrontendVersionDebugScreen {
    return new WorldFrontendVersionDebugScreen(settingDialog)
  }

  public update(): void {
    const worldElement =
      `Frontend Version: ${import.meta.env.VITE_FRONT_VERSION}` ?? 'Frontend Version: Versionの取得ができませんでした。'
    this.content.textContent = `${worldElement}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Frontend Version: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
