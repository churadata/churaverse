import { DomManager } from 'churaverse-engine-client'
import type { IWorldDeployVersionDebugScreen } from '../../IDebugRenderer/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import type { DebugSummaryScreenContainer } from '../debugSummaryScreenContainer'

export class WorldDeployVersionDebugScreen implements IWorldDeployVersionDebugScreen {
  private content: HTMLElement

  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const version = import.meta.env.VITE_DEPLOY_VERSION
    const element = version ? `Deploy Version: ${version}` : 'Deploy Version: Versionの取得ができませんでした。'
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugSummaryScreenContainer.addContent('worldInfo', this.content)
  }

  public update(): void {
    const version = import.meta.env.VITE_DEPLOY_VERSION
    const worldElement = version ? `Deploy Version: ${version}` : 'Deploy Version: Versionの取得ができませんでした。'
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
