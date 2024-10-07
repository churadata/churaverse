import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IWorldDeployVersionDebugScreen } from '../../../../../domain/IRender/IDebugRender/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class WorldDeployVersionDebugScreen implements IWorldDeployVersionDebugScreen {
  private content: HTMLElement

  public constructor(settingDialog: DebugSummaryScreen) {
    const element =
      `Deploy Version: ${import.meta.env.VITE_DEPLOY_VERSION}` ?? 'Deploy Version: Versionの取得ができませんでした。'
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('worldInfo', this.content)
  }

  public static build(settingDialog: DebugSummaryScreen): WorldDeployVersionDebugScreen {
    return new WorldDeployVersionDebugScreen(settingDialog)
  }

  public update(): void {
    const worldElement =
      `Deploy Version: ${import.meta.env.VITE_DEPLOY_VERSION}` ?? 'Deploy Version: Versionの取得ができませんでした。'
    this.content.textContent = `${worldElement}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Deploy Version: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
