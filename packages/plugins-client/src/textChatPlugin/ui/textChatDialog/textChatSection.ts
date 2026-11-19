import { Section } from '@churaverse/core-ui-plugin-client'
import type { TextChatDialogSectionMap } from './textChatDialog'

export class TextChatSection extends Section<keyof TextChatDialogSectionMap> {}
