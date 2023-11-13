import { Section } from '../dialog/section'
import { AdminSettingDialogSectionMap } from './adminSettingDialog'

export class AdminSettingSection extends Section<keyof AdminSettingDialogSectionMap> {}
