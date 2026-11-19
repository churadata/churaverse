import { Section } from '../dialog/section'
import type { SettingDialogSectionMap } from './settingDialog'

export class SettingSection extends Section<keyof SettingDialogSectionMap> {}
