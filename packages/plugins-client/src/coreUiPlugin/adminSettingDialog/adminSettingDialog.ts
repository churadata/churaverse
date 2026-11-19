import type { Props } from '../dialog/components/Panel'
import { Dialog } from '../dialog/dialog'
import type { IAdminSettingDialog } from '../interface/IAdminSettingDialog'
import type { AdminSettingSection } from './adminSettingSection'

export class AdminSettingDialog extends Dialog<AdminSettingSection> implements IAdminSettingDialog {
  public constructor() {
    const props: Props = {
      dialogName: '管理者設定',
    }
    super(props)
  }

  public static build(): Dialog<AdminSettingSection> {
    return new AdminSettingDialog()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AdminSettingDialogSectionMap {}
