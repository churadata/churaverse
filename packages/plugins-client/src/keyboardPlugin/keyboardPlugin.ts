import type { ActivateUiEvent, DeactivateUiEvent } from '@churaverse/core-ui-plugin-client'
import { CookieStore } from '@churaverse/data-persistence-plugin-client'
import type { WillSceneTransitionEvent } from '@churaverse/transition-plugin-client'
import {
  BasePlugin,
  type CVEvent,
  EVENT_PRIORITY,
  type PhaserSceneInit,
  type Scenes,
  SceneUndefinedError,
  type UpdateEvent,
} from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import { KeyActionManagerUndefinedError } from './error/keyActionManagerUndefinedError'
import { RegisterKeyActionEvent } from './event/registerKeyActionEvent'
import { RegisterKeyActionListenerEvent } from './event/registerKeyActionListenerEvent'
import type { IKeyboardSetupInfoWriter } from './interface/keySettingSave/IKeyboardSetupInfoWriter'
import { KeyActionManager } from './keyActionManager'
import { KeyFactory } from './keyFactory'
import { KeyboardSetupInfoReader } from './keySettingSave/keyboardSettingInfoReader'
import { KeyboardSetupInfoWriter } from './keySettingSave/keyboardSetupInfoWriter'
import { KeyStateGetter } from './keyStateGetter'
import { initKeyboardPluginStore } from './store/initKeyboardPluginStore'
import type { KeyCode } from './types/keyCode'
import type { CanSettingKeyActType } from './ui/keyboardSetting/canSettingKeyActionType'
import { setupKeyboardUi } from './ui/setupKeyboardUi'

export class KeyboardPlugin extends BasePlugin<Scenes> {
  private scene?: Scene
  private keyActionManager?: KeyActionManager<Scenes>
  private keyboardSettingInfoWriter?: IKeyboardSetupInfoWriter

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this), 'HIGH')
    this.bus.subscribeEvent('start', this.listenRegister.bind(this), EVENT_PRIORITY.HIGH)
    this.bus.subscribeEvent('start', this.start.bind(this))
    this.bus.subscribeEvent('willSceneTransition', this.willSceneTransition.bind(this))
    this.bus.subscribeEvent('update', this.update.bind(this))
    this.bus.subscribeEvent('activateUiEvent', this.onActivateUi.bind(this))
    this.bus.subscribeEvent('deactivateUiEvent', this.onDeactivateUi.bind(this))
    this.bus.subscribeEvent('onGameShutdown', this.onGameShutdown.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private async init(): Promise<void> {
    if (this.scene === undefined) throw new SceneUndefinedError()

    const cookieRepository = new CookieStore()
    this.keyboardSettingInfoWriter = new KeyboardSetupInfoWriter(cookieRepository)
    const keyboardSettingInfoReader = new KeyboardSetupInfoReader(cookieRepository)
    const savedKeyBindInfo = keyboardSettingInfoReader.read().keys ?? new Map<CanSettingKeyActType, KeyCode>()

    const keyStateGetter = new KeyStateGetter(this.scene)
    const keyFactory = new KeyFactory(keyStateGetter)
    this.keyActionManager = new KeyActionManager(keyFactory, savedKeyBindInfo)
    initKeyboardPluginStore(this.store, this.scene, this.keyActionManager, keyStateGetter)
  }

  private start(): void {
    if (this.keyActionManager === undefined) throw new KeyActionManagerUndefinedError()

    if (this.sceneName === 'MainScene') {
      setupKeyboardUi(this.store, this.keyActionManager)
    }
  }

  private willSceneTransition(ev: WillSceneTransitionEvent<Scenes, Scenes>): void {
    if (ev.from === 'MainScene' && ev.to === 'TitleScene') {
      this.onGameShutdown()
    }
  }

  private onGameShutdown(): void {
    if (this.keyActionManager === undefined) throw new KeyActionManagerUndefinedError()
    this.keyboardSettingInfoWriter?.save(this.keyActionManager.getAllRegistered())
  }

  /**
   * KeyAction登録イベントとMessageListener登録イベントをpostする
   */
  private listenRegister(): void {
    if (this.keyActionManager === undefined) throw new KeyActionManagerUndefinedError()

    this.bus.post(new RegisterKeyActionEvent(this.keyActionManager) as CVEvent<Scenes>)
    this.bus.post(new RegisterKeyActionListenerEvent(this.keyActionManager) as CVEvent<Scenes>)
  }

  private update(ev: UpdateEvent): void {
    this.keyActionManager?.update(ev.dt)
  }

  private onActivateUi(_ev: ActivateUiEvent): void {
    this.keyActionManager?.keyContextManager.setGui()
  }

  private onDeactivateUi(_ev: DeactivateUiEvent): void {
    this.keyActionManager?.keyContextManager.setInGame()
  }
}
