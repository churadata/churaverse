import { Section } from '../../plugins/coreUiPlugin/dialog/section'

export type InsertPosition = 'head' | 'tail'

/**
 * Dialog: 一時的に開かれる画面
 */
export interface IDialog<DialogSection extends Section = Section> {
  close: () => void
  open: () => void
  isOpen: boolean

  addSection: (section: DialogSection, addTo?: InsertPosition) => void
  addContent: (sectionId: DialogSection['sectionId'], content: HTMLElement, addTo?: InsertPosition) => void
}
