import { DomManager } from '../../../domManager'
import { DebugDetailScreen } from '../debugDetailScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import { IWebCameraIdDebugDetailScreen } from '../../../../../domain/IRender/IDebugRender/IWebCameraInfoDebugDetailScreen'

export class WebCameraIdDebugDetailScreen implements IWebCameraIdDebugDetailScreen {
  private content: HTMLElement
  private readonly cameraIds: Set<string> = new Set<string>()

  public constructor(settingDialog: DebugDetailScreen) {
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element: 'Ids: 0',
      })
    )
    settingDialog.addContent('webCameraInfo', this.content)
  }

  public static build(settingDialog: DebugDetailScreen): WebCameraIdDebugDetailScreen {
    return new WebCameraIdDebugDetailScreen(settingDialog)
  }

  public add(id: string): void {
    this.cameraIds.add(id)
    this.updateContent()
  }

  public delete(id: string): void {
    this.cameraIds.delete(id)
    this.updateContent()
  }

  private updateContent(): void {
    const connectedUsersCount = this.cameraIds.size
    const idsText = connectedUsersCount > 0 ? Array.from(this.cameraIds).join(', ') : ''
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
