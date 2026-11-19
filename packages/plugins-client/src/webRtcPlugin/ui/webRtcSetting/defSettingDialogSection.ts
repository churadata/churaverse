import type { SettingSection } from '@churaverse/core-ui-plugin-client'

declare module '@churaverse/core-ui-plugin-client' {
  export interface SettingDialogSectionMap {
    peripheralSetting: SettingSection
  }
}
