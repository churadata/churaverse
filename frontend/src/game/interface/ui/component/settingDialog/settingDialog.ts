import { Dialog } from '../dialog/dialog'
import { SettingSection } from './settingSection'
import { Props } from '../dialog/components/Panel'

/** メインカラー */
export const PRIMARY_COLOR = 'lightsteelblue'

/**
 * プレイヤーの設定に関するUI
 */
export class SettingDialog extends Dialog<keyof SettingDialogSectionMap, SettingSection> {
  public constructor() {
    const props: Props = {
      dialogName: 'プレイヤー設定',
    }
    super(props)
  }

  public static build(): Dialog<keyof SettingDialogSectionMap, SettingSection> {
    return new SettingDialog()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingDialogSectionMap {}
