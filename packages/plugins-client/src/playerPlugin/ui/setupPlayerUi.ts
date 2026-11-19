import { SettingSection } from '@churaverse/core-ui-plugin-client'
import type { IEventBus, IMainScene, ITitleScene, Store } from 'churaverse-engine-client'
import { JoinLeaveLogRenderer } from './joinLeaveLogRenderer/joinLeaveLogRenderer'
import { PlayerColorButtons } from './playerSetting/playerColorButtons'
import { RenameForm } from './playerSetting/renameForm'
import '@churaverse/keyboard-plugin-client'
import '../sceneTransitionData/defTitleToMainData'

export class PlayerUi {
  private readonly renameForm: RenameForm
  private readonly playerColorButtons: PlayerColorButtons

  public constructor(
    private readonly store: Store<IMainScene>,
    eventBus: IEventBus<IMainScene>
  ) {
    const transitionPluginStore = store.of('transitionPlugin')
    const playerPluginStore = store.of('playerPlugin')
    const uiStore = store.of('coreUiPlugin')
    const keyboardStore = store.of('keyboardPlugin')
    const player = transitionPluginStore.transitionManager.getReceivedData<ITitleScene>().ownPlayer
    uiStore.settingDialog.addSection(new SettingSection('playerSetting', 'プレイヤー設定'), 'head')
    this.renameForm = RenameForm.build(playerPluginStore.ownPlayerId, player.name, uiStore.settingDialog, eventBus)

    this.playerColorButtons = PlayerColorButtons.build(
      playerPluginStore.ownPlayerId,
      player.color,
      uiStore.settingDialog,
      eventBus
    )

    keyboardStore.keySettingWindow.addKeyAction('walkDown', '下に移動')
    keyboardStore.keySettingWindow.addKeyAction('walkUp', '上に移動')
    keyboardStore.keySettingWindow.addKeyAction('walkRight', '右に移動')
    keyboardStore.keySettingWindow.addKeyAction('walkLeft', '左に移動')
    keyboardStore.keySettingWindow.addKeyAction('focusNext', 'カメラフォーカス対象の切り替え', 50)
  }

  public setupJoinLeaveLogRenderer(): JoinLeaveLogRenderer {
    const fadeOutLogRenderer = this.store.of('coreUiPlugin').fadeOutLogRenderer
    const joinLeaveLogRenderer = new JoinLeaveLogRenderer(fadeOutLogRenderer)
    return joinLeaveLogRenderer
  }

  public updatePlayerId(playerId: string): void {
    this.renameForm.updatePlayerId(playerId)
    this.playerColorButtons.updatePlayerId(playerId)
  }
}
