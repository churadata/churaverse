import { Section } from '../dialog/section'
import { TextChatDialogSectionMap } from './textChatDialog'

export class TextChatSection extends Section {
  public constructor(public readonly sectionId: keyof TextChatDialogSectionMap, sectionLabel: string) {
    super(sectionId, sectionLabel)
  }
}
