import { DebugSectionId, PRIMARY_COLOR } from './debugSummaryScreen'

export class DebugSummaryScreenSection {
  private readonly container: HTMLElement

  /**
   * @param sectionId 識別用の名前. ユニークな文字列でなければならない
   * @param sectionLabel セクション名としてUI上に表示される文字列
   */
  public constructor(public readonly sectionId: DebugSectionId, sectionLabel: string) {
    this.container = document.createElement('section')

    this.container.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    row-gap: 20px;
    width: 100%;
    row-gap: 0px;
    `

    this.createSectionLabel(sectionLabel)
  }

  private createSectionLabel(sectionName: string): void {
    const sectionLabel = document.createElement('div')
    sectionLabel.textContent = sectionName
    sectionLabel.style.cssText = `
    text-align: left;
    font-size: 0.9em;
    width: 100%;
    border-bottom: solid ${PRIMARY_COLOR} 2px;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    `
    this.container.appendChild(sectionLabel)
  }

  public addContent(content: HTMLElement): void {
    this.container.appendChild(content)
  }

  public get node(): HTMLElement {
    return this.container
  }
}
