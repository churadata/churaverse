import type { Props } from '../dialog/components/Panel'
import { Dialog } from '../dialog/dialog'
import type { ISettingDialog } from '../interface/ISettingDialog'
import type { SettingSection } from './settingSection'

/** メインカラー */
export const PRIMARY_COLOR = 'lightsteelblue'

/**
 * プレイヤーの設定に関するUI
 */
export class SettingDialog extends Dialog<SettingSection> implements ISettingDialog {
  public constructor() {
    const props: Props = {
      dialogName: 'プレイヤー設定',
    }
    super(props)
  }

  public static build(): Dialog<SettingSection> {
    return new SettingDialog()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingDialogSectionMap {}
