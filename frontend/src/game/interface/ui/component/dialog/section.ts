import { PRIMARY_COLOR } from './dialog'

export abstract class Section<T = string> {
  private readonly container: HTMLElement

  /**
   * @param sectionId 識別用の名前. ユニークな文字列でなければならない
   * @param sectionLabel セクション名としてUI上に表示される文字列
   */
  public constructor(public readonly sectionId: T, sectionLabel: string) {
    this.container = document.createElement('section')

    this.container.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      row-gap: 20px;
      width: 100%;
      `

    this.createSectionLabel(
      sectionLabel,
      `
      text-align: left;
      font-size: 0.9em;
      width: 100%;
      border-bottom: solid ${PRIMARY_COLOR} 1px;
      `
    )
  }

  /**
   * @param sectionName 追加するセクションに指定する名称
   * @param borderBottomColor border-bottom に指定する色
   */
  private createSectionLabel(sectionName: string, cssText: string): void {
    const sectionLabel = document.createElement('div')
    sectionLabel.textContent = sectionName
    sectionLabel.style.cssText = cssText
    this.container.appendChild(sectionLabel)
  }

  public addContent(content: HTMLElement): void {
    this.container.appendChild(content)
  }

  public get node(): HTMLElement {
    return this.container
  }
}
