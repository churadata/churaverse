import { IDialog } from '../../../../domain/IRender/IDialog'
import { DomManager } from 'churaverse-engine-client'
import { DebugScreenBoardComponent } from './components/DebugScreenBoardComponent'
import { DebugScreenDumpButtonComponent } from './components/DebugScreenDumpButtonComponent'
import { DebugSummaryScreenSection } from './debugSummaryScreenSection'

/** メインカラー */
export const PRIMARY_COLOR = 'lightsteelblue'

export class DebugSummaryScreen implements IDialog {
  private readonly sections = new Map<DebugSectionId, DebugSummaryScreenSection>()

  private readonly container: HTMLElement
  private readonly visibleDisplayStyle = 'flex'
  private _isOpen = false

  private constructor() {
    const dialogPanelElement = DomManager.addJsxDom(DebugScreenBoardComponent())
    const dumpButton = DomManager.jsxToDom(DebugScreenDumpButtonComponent())
    this.container = dialogPanelElement
    this.container.appendChild(dumpButton)
    this.setupDefaultSections()
    this.close()
  }

  public static async build(): Promise<DebugSummaryScreen> {
    return new DebugSummaryScreen()
  }

  private setupDefaultSections(): void {
    const defaultSections = [
      new DebugSummaryScreenSection('playerInfo', 'Player'),
      new DebugSummaryScreenSection('worldInfo', 'World'),
    ]
    defaultSections.forEach((section) => {
      this.addSection(section)
    })
  }

  /**
   * セクションを追加する
   * @param section 追加したいセクション
   */
  public addSection(section: DebugSummaryScreenSection): void {
    this.sections.set(section.sectionId, section)
    this.container.appendChild(section.node)
  }

  /**
   * idで指定したセクション内に要素を追加する
   * @param sectionId 追加先のセクションのid
   * @param content 追加したい要素
   */
  public addContent(sectionId: DebugSectionId, content: HTMLElement): void {
    const section = this.sections.get(sectionId)
    if (section === undefined) {
      console.warn(`id: ${sectionId}のセクションがDebugSummaryScreenに存在しない`)
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
export interface DebugScreenSettingSectionMap {
  playerInfo: DebugSummaryScreenSection
  worldInfo: DebugSummaryScreenSection
}

export type DebugSectionId = keyof DebugScreenSettingSectionMap & string
