import { DomManager } from '../../../domManager'
import { DebugDetailScreen } from '../debugDetailScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import { IScreenShareIdDebugDetailScreen } from '../../../../../domain/IRender/IDebugRender/IScreenShareInfoDebugDetailScreen'

export class ScreenShareIdDebugDetailScreen implements IScreenShareIdDebugDetailScreen {
  private content: HTMLElement
  private readonly screenShareIds: Set<string> = new Set<string>()

  public constructor(settingDialog: DebugDetailScreen) {
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element: 'Ids: 0',
      })
    )
    settingDialog.addContent('screenShareInfo', this.content)
  }

  public static build(settingDialog: DebugDetailScreen): ScreenShareIdDebugDetailScreen {
    return new ScreenShareIdDebugDetailScreen(settingDialog)
  }

  public add(id: string): void {
    this.screenShareIds.add(id)
    this.updateContent()
  }

  public delete(id: string): void {
    this.screenShareIds.delete(id)
    this.updateContent()
  }

  private updateContent(): void {
    const connectedUsersCount = this.screenShareIds.size
    const idsText = connectedUsersCount > 0 ? Array.from(this.screenShareIds).join(', ') : ''
    this.content.innerHTML = `Ids: ${connectedUsersCount}<br>${idsText}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Ids: (.+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
