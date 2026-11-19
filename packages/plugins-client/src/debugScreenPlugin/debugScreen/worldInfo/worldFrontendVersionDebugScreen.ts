import { DomManager } from 'churaverse-engine-client'
import type { IWorldFrontendVersionDebugScreen } from '../../IDebugRenderer/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import type { DebugSummaryScreenContainer } from '../debugSummaryScreenContainer'

export class WorldFrontendVersionDebugScreen implements IWorldFrontendVersionDebugScreen {
  private content: HTMLElement

  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const version = import.meta.env.VITE_DEPLOY_VERSION
    const element = version ? `Frontend Version: ${version}` : 'Frontend Version: Versionの取得ができませんでした。'
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugSummaryScreenContainer.addContent('worldInfo', this.content)
  }

  public update(): void {
    const version = import.meta.env.VITE_DEPLOY_VERSION
    const worldElement = version
      ? `Frontend Version: ${version}`
      : 'Frontend Version: Versionの取得ができませんでした。'
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
