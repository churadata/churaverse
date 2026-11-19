import { DomManager, domLayerSetting, makeLayerHigherTemporary } from 'churaverse-engine-client'
import { CvUi } from '../cvUi'
import type { IDialog, InsertPosition } from '../domain/interface/IRender/IDialog'
import { DialogPanel, type Props } from './components/Panel'
import type { Section } from './section'
/** メインカラー */
export const PRIMARY_COLOR = 'lightsteelblue'

export const DIALOG_SECTION_CONTAINER_ID: (dialogName: string) => string = (dialogName) => {
  return `dialog-section-container-${dialogName}`
}

/**
 * 各機能のUIのベースとなる共通ダイアログ
 */
export abstract class Dialog<Sections extends Section> extends CvUi implements IDialog<Sections> {
  private readonly sections = new Map<Sections['sectionId'], Sections>()

  private readonly sectionContainer: HTMLElement
  public readonly node: HTMLElement
  private readonly visibleDisplayStyle = 'flex'
  private _isOpen = false

  public constructor(props: Props) {
    super()
    this.node = DomManager.addJsxDom(DialogPanel(props))
    this.sectionContainer = DomManager.getElementById(DIALOG_SECTION_CONTAINER_ID(props.dialogName))

    this.node.addEventListener('mousedown', () => {
      makeLayerHigherTemporary(this.sectionContainer, 'low')
    })

    domLayerSetting(this.node, props.layer ?? 'low')

    this.close()
  }

  /**
   * セクションを追加する
   * @param section 追加したいセクション
   */
  public addSection(section: Sections, addTo: InsertPosition = 'tail'): void {
    this.sections.set(section.sectionId, section)
    if (addTo === 'head') {
      this.sectionContainer.insertAdjacentElement('afterbegin', section.node)
    } else if (addTo === 'tail') {
      this.sectionContainer.appendChild(section.node)
    }
  }

  /**
   * idで指定したセクション内に要素を追加する
   * @param sectionId 追加先のセクションのid
   * @param content 追加したい要素
   * @param insertAt 追加する位置. head=sectionの一番上, tail=sectionの一番下
   */
  public addContent(sectionId: Section['sectionId'], content: HTMLElement, addTo: InsertPosition = 'tail'): void {
    const section = this.sections.get(sectionId)
    if (section === undefined) {
      console.warn(`id: ${sectionId}のセクションがDialogに存在しない`)

      return
    }

    if (addTo === 'head') {
      section.addContentToHead(content)
    } else if (addTo === 'tail') {
      section.addContent(content)
    }
  }

  /**
   * コンテンツを直接ダイアログに追加する
   * @param content 追加したい要素
   */
  public directlyAddContent(content: HTMLElement): void {
    this.sectionContainer.appendChild(content)
  }

  public open(): void {
    this._isOpen = true
    this.node.style.display = this.visibleDisplayStyle
  }

  public close(): void {
    this._isOpen = false
    this.node.style.display = 'none'
  }

  public get isOpen(): boolean {
    return this._isOpen
  }
}
