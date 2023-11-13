import { Dialog } from '../dialog/dialog'
import { AdminSettingSection } from './adminSettingSection'
import { Props } from '../dialog/components/Panel'

export class AdminSettingDialog extends Dialog<keyof AdminSettingDialogSectionMap, AdminSettingSection> {
  public constructor() {
    const props: Props = {
      dialogName: '管理者設定',
    }
    super(props)
  }

  public static build(): Dialog<keyof AdminSettingDialogSectionMap, AdminSettingSection> {
    return new AdminSettingDialog()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AdminSettingDialogSectionMap {}
