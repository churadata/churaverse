import { FocusNextTargetEvent } from '@churaverse/core-ui-plugin-client'
import type { RegisterKeyActionEvent, RegisterKeyActionListenerEvent } from '@churaverse/keyboard-plugin-client'
import { BaseKeyboardController, KeyAction } from '@churaverse/keyboard-plugin-client'
import { Direction, type IEventBus, type IMainScene, type Store } from 'churaverse-engine-client'
import { PlayerWalkEvent } from '../event/playerWalkEvent'
import type { PlayerPluginStore } from '../store/defPlayerPluginStore'
import '../keyAction/defFocusNextKeyAction'

export class KeyboardController extends BaseKeyboardController<IMainScene> {
  private playerPluginStore!: PlayerPluginStore

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
  }

  private getStores(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public registerKeyAction(ev: RegisterKeyActionEvent<IMainScene>): void {
    ev.keyActionRegister.registerKeyAction(new KeyAction('walkDown', 'DOWN'))
    ev.keyActionRegister.registerKeyAction(new KeyAction('walkUp', 'UP'))
    ev.keyActionRegister.registerKeyAction(new KeyAction('walkLeft', 'LEFT'))
    ev.keyActionRegister.registerKeyAction(new KeyAction('walkRight', 'RIGHT'))
    ev.keyActionRegister.registerKeyAction(new KeyAction('focusNext', 'V', 'inGame', Infinity))
  }

  public registerKeyActionListener(ev: RegisterKeyActionListenerEvent<IMainScene>): void {
    ev.keyActionListenerRegister.on('walkDown', this.walkDown.bind(this))
    ev.keyActionListenerRegister.on('walkUp', this.walkUp.bind(this))
    ev.keyActionListenerRegister.on('walkLeft', this.walkLeft.bind(this))
    ev.keyActionListenerRegister.on('walkRight', this.walkRight.bind(this))
    ev.keyActionListenerRegister.on('focusNext', this.focusNext.bind(this))
  }

  private focusNext(): void {
    this.eventBus.post(new FocusNextTargetEvent())
  }

  private walkDown(): void {
    this.eventBus.post(new PlayerWalkEvent(this.playerPluginStore.ownPlayerId, Direction.down))
  }

  private walkUp(): void {
    this.eventBus.post(new PlayerWalkEvent(this.playerPluginStore.ownPlayerId, Direction.up))
  }

  private walkLeft(): void {
    this.eventBus.post(new PlayerWalkEvent(this.playerPluginStore.ownPlayerId, Direction.left))
  }

  private walkRight(): void {
    this.eventBus.post(new PlayerWalkEvent(this.playerPluginStore.ownPlayerId, Direction.right))
  }
}
