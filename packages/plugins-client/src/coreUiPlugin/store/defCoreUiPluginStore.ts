import type { FadeOutLogRenderer } from '../fadeOutLog/fadeOutLogRenderer'
import type { IAdminSettingDialog } from '../interface/IAdminSettingDialog'
import type { IDialogSwitcher } from '../interface/IDialogSwitcher'
import type { IExitButton } from '../interface/IExitButton'
import type { IFocusTargetRepository } from '../interface/IFocusTargetRepository'
import type { ISettingDialog } from '../interface/ISettingDialog'
import type { ITopBarIconContainer } from '../interface/ITopBarIconContainer'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    coreUiPlugin: CoreUiPluginStore
  }
}
export interface CoreUiPluginStore {
  readonly exitButton: IExitButton
  readonly topBarIconContainer: ITopBarIconContainer
  readonly settingDialog: ISettingDialog
  readonly adminSettingDialog: IAdminSettingDialog
  readonly switcher: IDialogSwitcher
  readonly fadeOutLogRenderer: FadeOutLogRenderer
  readonly focusTargetRepository: IFocusTargetRepository
}
