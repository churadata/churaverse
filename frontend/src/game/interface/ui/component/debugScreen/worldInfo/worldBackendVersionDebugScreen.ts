import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IWorldBackendVersionDebugScreen } from '../../../../../domain/IRender/IDebugRender/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class WorldBackendVersionDebugScreen implements IWorldBackendVersionDebugScreen {
  private content: HTMLElement

  public constructor(settingDialog: DebugSummaryScreen) {
    this.content = document.createElement('div')
    void this.getBackendVersion().then((resolve) => {
      const element = `Backend Version: ${resolve}`
      this.content = DomManager.jsxToDom(
        ElementDebugScreenComponent({
          element,
        })
      )
      settingDialog.addContent('worldInfo', this.content)
    })
  }

  public static build(settingDialog: DebugSummaryScreen): WorldBackendVersionDebugScreen {
    return new WorldBackendVersionDebugScreen(settingDialog)
  }

  public async getBackendVersion(): Promise<string> {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '') + '/version').catch(() => {
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
