import { DomManager } from 'churaverse-engine-client'
import { ElementDebugScreenComponent } from '../debugScreen/components/ElementDebugScreenComponent'
import type { DebugSummaryScreenContainer } from '../debugScreen/debugSummaryScreenContainer'
import type { DebugScreenSectionId } from '../debugScreen/IDebugScreenContainer/IDebugSummaryScreenContainer'

export abstract class BaseDebugSummaryScreen {
  protected readonly content: HTMLElement
  public constructor(
    debugSummaryScreenContainer: DebugSummaryScreenContainer,
    sectionName: DebugScreenSectionId,
    element: string
  ) {
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugSummaryScreenContainer.addContent(sectionName, this.content)
  }
}
