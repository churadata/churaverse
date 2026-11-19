import type { IEventBus, IMainScene, Scenes, Store } from 'churaverse-engine-client'
import { AdminSettingDialog } from '../adminSettingDialog/adminSettingDialog'
import { DialogSwitcher } from '../dialog/dialogSwitcher'
import { ExitButton } from '../exit/exitButton'
import { FadeOutLogRenderer } from '../fadeOutLog/fadeOutLogRenderer'
import type { IFocusTargetRepository } from '../interface/IFocusTargetRepository'
import { SettingDialog } from '../settingDialog/settingDialog'
import { TopBarIconContainer } from '../topBarIconContainer'
import type { CoreUiPluginStore } from './defCoreUiPluginStore'

export function initCoreUiPlugin(
  eventBus: IEventBus<Scenes>,
  store: Store<IMainScene>,
  scene: Phaser.Scene,
  focusTargetRepository: IFocusTargetRepository
): void {
  const pluginStore: CoreUiPluginStore = {
    exitButton: new ExitButton(eventBus),
    topBarIconContainer: new TopBarIconContainer(),
    settingDialog: new SettingDialog(),
    adminSettingDialog: new AdminSettingDialog(),
    switcher: new DialogSwitcher(eventBus),
    fadeOutLogRenderer: new FadeOutLogRenderer(scene, 300),
    focusTargetRepository,
  }

  store.setInit('coreUiPlugin', pluginStore)
}
