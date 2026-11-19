import type { AdminSettingSection } from '@churaverse/core-ui-plugin-client'

declare module '@churaverse/core-ui-plugin-client' {
  export interface AdminSettingDialogSectionMap {
    mapSetting: AdminSettingSection
  }
}
