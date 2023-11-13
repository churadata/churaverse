import { Section } from '../dialog/section'
import { SettingDialogSectionMap } from './settingDialog'

export class SettingSection extends Section {
  public constructor(public readonly sectionId: keyof SettingDialogSectionMap, sectionLabel: string) {
    super(sectionId, sectionLabel)
  }
}
