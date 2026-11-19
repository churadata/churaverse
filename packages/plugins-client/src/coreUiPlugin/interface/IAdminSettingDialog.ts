import type { AdminSettingSection } from '../adminSettingDialog/adminSettingSection'
import type { IDialog } from '../domain/interface/IRender/IDialog'

export interface IAdminSettingDialog extends IDialog<AdminSettingSection> {}

declare module './IDialogSwitcher' {
  export interface DialogMap {
    adminSetting: IAdminSettingDialog
  }
}
