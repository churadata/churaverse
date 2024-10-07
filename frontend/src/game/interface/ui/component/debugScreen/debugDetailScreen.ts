import { IDialog } from '../../../../domain/IRender/IDialog'
import { DomManager } from '../../domManager'
import { DebugDetailScreenBoardComponent } from './components/DebugDetailScreenBoardComponent'
import { DebugDetailScreenSection } from './debugDetailScreenSection'

export class DebugDetailScreen implements IDialog {
  private readonly sections = new Map<DebugDetailScreenSectionId, DebugDetailScreenSection>()

  private readonly container: HTMLElement
  private readonly visibleDisplayStyle = 'flex'
  private _isOpen = false

  private constructor() {
    const dialogPanelElement = DomManager.addJsxDom(DebugDetailScreenBoardComponent())
    this.container = dialogPanelElement
    this.setupDefaultSections()
    this.close()
  }

  public static async build(): Promise<DebugDetailScreen> {
    return new DebugDetailScreen()
  }

  private setupDefaultSections(): void {
    const defaultSections = [
      new DebugDetailScreenSection('sharkInfo', 'Shark'),
      new DebugDetailScreenSection('bombInfo', 'Bomb'),
      new DebugDetailScreenSection('mapInfo', 'Map'),
      new DebugDetailScreenSection('invincibleModeInfo', 'InvincibleMode'),
      new DebugDetailScreenSection('webCameraInfo', 'WebCamera'),
      new DebugDetailScreenSection('screenShareInfo', 'ScreenShare'),
      new DebugDetailScreenSection('microphoneInfo', 'Microphone'),
      new DebugDetailScreenSection('megaphoneInfo', 'Megaphone'),
    ]
    defaultSections.forEach((section) => {
      this.addSection(section)
    })
  }

  /**
   * セクションを追加する
   * @param section 追加したいセクション
   */
  public addSection(section: DebugDetailScreenSection): void {
    this.sections.set(section.sectionId, section)
    this.container.appendChild(section.node)
  }

  /**
   * idで指定したセクション内に要素を追加する
   * @param sectionId 追加先のセクションのid
   * @param content 追加したい要素
   */
  public addContent(sectionId: DebugDetailScreenSectionId, content: HTMLElement): void {
    const section = this.sections.get(sectionId)
    if (section === undefined) {
      console.warn(`id: ${sectionId}のセクションがDebugDetailScreenに存在しない`)
      return
    }

    section.addContent(content)
  }

  public open(): void {
    this._isOpen = true
    this.container.style.display = this.visibleDisplayStyle
  }

  public close(): void {
    this._isOpen = false
    this.container.style.display = 'none'
  }

  public get isOpen(): boolean {
    return this._isOpen
  }
}

/**
 * 新しいセクションを追加する場合はこのinterfaceに定義を追加する
 */
export interface DebugDetailScreenSettingSectionMap {
  sharkInfo: DebugDetailScreenSection
  bombInfo: DebugDetailScreenSection
  mapInfo: DebugDetailScreenSection
  invincibleModeInfo: DebugDetailScreenSection
  webCameraInfo: DebugDetailScreenSection
  screenShareInfo: DebugDetailScreenSection
  microphoneInfo: DebugDetailScreenSection
  megaphoneInfo: DebugDetailScreenSection
}

export type DebugDetailScreenSectionId = keyof DebugDetailScreenSettingSectionMap & string
