import { DomManager } from 'churaverse-engine-client'
import type { IWorldBackendVersionDebugScreen } from '../../IDebugRenderer/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import type { DebugSummaryScreenContainer } from '../debugSummaryScreenContainer'

export class WorldBackendVersionDebugScreen implements IWorldBackendVersionDebugScreen {
  private content: HTMLElement

  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    this.content = document.createElement('div')
    void this.getBackendVersion().then((resolve) => {
      const element = `Backend Version: ${resolve}`
      this.content = DomManager.jsxToDom(
        ElementDebugScreenComponent({
          element,
        })
      )
      debugSummaryScreenContainer.addContent('worldInfo', this.content)
    })
  }

  public async getBackendVersion(): Promise<string> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/version`).catch(() => {
      return null
    })
    if (response === null) {
      return 'Backend Version: Versionの取得ができませんでした。'
    }
    return await response.text().catch(() => {
      return 'Backend Version: Versionの取得ができませんでした。'
    })
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Backend Version: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }

  public update(): void {
    void this.getBackendVersion().then((resolve) => {
      const worldElement = `Backend Version: ${resolve}`
      this.content.textContent = `${worldElement}`
    })
  }
}
