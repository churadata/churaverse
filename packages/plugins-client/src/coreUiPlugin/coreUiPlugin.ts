import type { TransitionPluginStore } from '@churaverse/transition-plugin-client'
import {
  BasePlugin,
  DomManager,
  EVENT_PRIORITY,
  type IMainScene,
  type PhaserSceneInit,
  SceneUndefinedError,
  type StartEvent,
} from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import { FocusSwitcher } from './focusSwitcher/focusSwitcher'
import { SettingIcon } from './settingDialog/settingIcon'
import type { CoreUiPluginStore } from './store/defCoreUiPluginStore'
import { initCoreUiPlugin } from './store/initCoreUiPluginStore'
// import because of dependency
import '@churaverse/transition-plugin-client'

const SCROLL_KEYS: ReadonlySet<string> = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '])

export class CoreUiPlugin extends BasePlugin<IMainScene> {
  private scene?: Scene
  private coreUiPluginStore!: CoreUiPluginStore
  private transitionPluginStore!: TransitionPluginStore<IMainScene>
  private readonly focusSwitcher = new FocusSwitcher()

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this), 'HIGHEST')
    this.bus.subscribeEvent('init', this.getStores.bind(this), 'LOW')

    this.bus.subscribeEvent('ownPlayerExit', this.exitOwnPlayer.bind(this))
    this.bus.subscribeEvent('focusNextTarget', this.onFocusNextTarget.bind(this))
    this.bus.subscribeEvent('willSceneTransition', this.onWillSceneTransition.bind(this), EVENT_PRIORITY.LOWEST)
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(): void {
    if (this.scene === undefined) {
      throw new SceneUndefinedError()
    }
    initCoreUiPlugin(this.bus, this.store, this.scene, this.focusSwitcher)
    this.setupArrowKeyScrollPrevention()
  }

  private getStores(): void {
    this.transitionPluginStore = this.store.of('transitionPlugin')
    this.coreUiPluginStore = this.store.of('coreUiPlugin')
  }

  private start(_ev: StartEvent): void {
    if (this.scene === undefined) return

    void new SettingIcon(
      this.coreUiPluginStore.switcher,
      this.coreUiPluginStore.settingDialog,
      this.coreUiPluginStore.topBarIconContainer
    )
  }

  public exitOwnPlayer(): void {
    // TitleSceneに遷移
    this.transitionPluginStore.transitionManager.transitionTo('TitleScene')
  }

  private onFocusNextTarget(): void {
    this.focusSwitcher.focusNext()
  }

  private onWillSceneTransition(): void {
    DomManager.removeAll()
  }

  private setupArrowKeyScrollPrevention(): void {
    window.addEventListener('keydown', (e) => {
      if (!SCROLL_KEYS.has(e.key)) return

      const ae = document.activeElement
      if (
        ae instanceof HTMLInputElement ||
        ae instanceof HTMLTextAreaElement ||
        ae instanceof HTMLSelectElement ||
        (ae instanceof HTMLElement && ae.isContentEditable)
      ) {
        return
      }
      e.preventDefault()
    })
  }
}
