import { IDialog } from '../../../../domain/IRender/IDialog'
import { DomManager } from '../../util/domManager'
import { Section } from './section'
import { DialogPanel, Props } from './components/Panel'
import { makeLayerHigherTemporary } from '../../util/makeLayerHigherTemporary'
import { domLayerSetting } from '../../util/domLayer'
/** メインカラー */
export const PRIMARY_COLOR = 'lightsteelblue'

/**
 * 各機能のUIのベースとなる共通ダイアログ
 */
export abstract class Dialog<SectionIds, Sections extends Section> implements IDialog {
  private readonly sections = new Map<SectionIds, Sections>()

  public container: HTMLElement
  private readonly visibleDisplayStyle = 'flex'
  private _isOpen = false

  public constructor(props: Props) {
    const dialogPanelElement = DomManager.addJsxDom(DialogPanel(props))
    this.container = dialogPanelElement

    this.container.addEventListener('mousedown', () => {
      makeLayerHigherTemporary(this.container, 'low')
    })

    domLayerSetting(this.container, props.layer ?? 'low')

    this.close()
  }

  /**
   * セクションを追加する
   * @param section 追加したいセクション
   */
  public addSection(section: Sections): void {
    this.sections.set(section.sectionId as SectionIds, section)
    this.container.appendChild(section.node)
  }

  /**
   * idで指定したセクション内に要素を追加する
   * @param sectionId 追加先のセクションのid
   * @param content 追加したい要素
   */
  public addContent(sectionId: SectionIds, content: HTMLElement): void {
    const section = this.sections.get(sectionId)
    if (section === undefined) {
      console.warn(`id: ${sectionId as string}のセクションがDialogに存在しない`)

      return
    }

    section.addContent(content)
  }

  /**
   * コンテンツを直接ダイアログに追加する
   * @param content 追加したい要素
   */
  public directlyAddContent(content: HTMLElement): void {
    this.container.appendChild(content)
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
