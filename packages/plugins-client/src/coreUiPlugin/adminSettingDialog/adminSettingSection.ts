import { Section } from '../dialog/section'
import type { AdminSettingDialogSectionMap } from './adminSettingDialog'

export class AdminSettingSection extends Section<keyof AdminSettingDialogSectionMap> {}
