import type { RegisterKeyActionEvent, RegisterKeyActionListenerEvent } from '@churaverse/keyboard-plugin-client'
import { BaseKeyboardController, KeyAction } from '@churaverse/keyboard-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import type { DebugScreenPluginStore } from '../store/defDebugScreenPluginStore'

export class KeyboardController extends BaseKeyboardController<IMainScene> {
  private debugScreenPluginStore!: DebugScreenPluginStore

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
  }

  private getStores(): void {
    this.debugScreenPluginStore = this.store.of('debugScreenPlugin')
  }

  public registerKeyAction(ev: RegisterKeyActionEvent<IMainScene>): void {
    ev.keyActionRegister.registerKeyAction(new KeyAction('ToggleDebugScreen', 'P', 'inGame', Infinity))
  }

  public registerKeyActionListener(ev: RegisterKeyActionListenerEvent<IMainScene>): void {
    ev.keyActionListenerRegister.on('ToggleDebugScreen', this.toggleDebugScreen.bind(this))
  }

  private toggleDebugScreen(): void {
    const debugSummaryScreenContainer = this.debugScreenPluginStore.debugSummaryScreenContainer
    const debugDetailScreenContainer = this.debugScreenPluginStore.debugDetailScreenContainer
    if (debugSummaryScreenContainer.isOpen && debugDetailScreenContainer.isOpen) {
      debugSummaryScreenContainer.close()
      debugDetailScreenContainer.close()
    } else {
      debugSummaryScreenContainer.open()
      debugDetailScreenContainer.open()
    }
  }
}
