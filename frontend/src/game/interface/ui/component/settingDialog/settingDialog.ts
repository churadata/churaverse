import { Scene } from 'phaser'
import { IDialog } from '../../../../domain/IRender/IDialog'
import { DomManager } from '../../util/domManager'
import { SettingSection } from './settingSection'
import { SettingDialogPanel } from './components/SettingDialogPanel'
import { domLayerSetting } from '../../util/domLayer'
import { makeLayerHigherTemporary } from '../../util/makeLayerHigherTemporary'

/** メインカラー */
export const PRIMARY_COLOR = 'lightsteelblue'

/**
 * プレイヤーの設定に関するUI
 */
export class SettingDialog implements IDialog {
  private readonly sections = new Map<SectionId, SettingSection>()

  private readonly container: HTMLElement
  private readonly visibleDisplayStyle = 'flex'
  private _isOpen = false

  private constructor() {
    const dialogPanelElement = DomManager.addJsxDom(SettingDialogPanel())
    this.container = dialogPanelElement
    domLayerSetting(this.container, 'low')

    this.container.addEventListener('mousedown', () => {
      makeLayerHigherTemporary(this.container, 'low')
    })

    this.setupDefaultSections()

    this.close()
  }

  public static async build(scene: Scene): Promise<SettingDialog> {
    return new SettingDialog()
  }

  private setupDefaultSections(): void {
    const defaultSections = [new SettingSection('playerSetting', 'プレイヤー設定')]
    defaultSections.forEach((section) => {
      this.addSection(section)
    })
  }

  /**
   * セクションを追加する
   * @param section 追加したいセクション
   */
  public addSection(section: SettingSection): void {
    this.sections.set(section.sectionId, section)
    this.container.appendChild(section.node)
  }

  /**
   * idで指定したセクション内に要素を追加する
   * @param sectionId 追加先のセクションのid
   * @param content 追加したい要素
   */
  public addContent(sectionId: SectionId, content: HTMLElement): void {
    const section = this.sections.get(sectionId)
    if (section === undefined) {
      console.warn(`id: ${sectionId}のセクションがSettingDialogに存在しない`)
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
export interface SettingSectionMap {
  playerSetting: SettingSection
  peripheralSetting: SettingSection
}

export type SectionId = keyof SettingSectionMap & string
