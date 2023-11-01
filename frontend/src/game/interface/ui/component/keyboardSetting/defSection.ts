import { SettingSection } from '../settingDialog/settingSection'

declare module '../settingDialog/settingDialog' {
  export interface SettingSectionMap {
    keyboardSetting: SettingSection
  }
}
