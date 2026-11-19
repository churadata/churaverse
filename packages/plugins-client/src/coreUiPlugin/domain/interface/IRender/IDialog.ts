import type { Section } from '../../../dialog/section'

export type InsertPosition = 'head' | 'tail'

/**
 * Dialog: 一時的に開かれる画面
 */
export interface IDialog<DialogSection extends Section = Section> {
  readonly node: HTMLElement
  isOpen: boolean

  close: () => void
  open: () => void
  addSection: (section: DialogSection, addTo?: InsertPosition) => void
  addContent: (sectionId: DialogSection['sectionId'], content: HTMLElement, addTo?: InsertPosition) => void
}
