import { DomManager } from 'churaverse-engine-client'
import type { IWorldNameDebugScreen } from '../../IDebugRenderer/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import type { DebugSummaryScreenContainer } from '../debugSummaryScreenContainer'

export class WorldNameDebugScreen implements IWorldNameDebugScreen {
  private content: HTMLElement

  public constructor(name: string, debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Name: ${name}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugSummaryScreenContainer.addContent('worldInfo', this.content)
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
