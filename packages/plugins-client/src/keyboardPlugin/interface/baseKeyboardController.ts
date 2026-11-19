import type { IEventBus, Scenes, Store } from 'churaverse-engine-client'
import type { RegisterKeyActionEvent } from '../event/registerKeyActionEvent'
import type { RegisterKeyActionListenerEvent } from '../event/registerKeyActionListenerEvent'

export abstract class BaseKeyboardController<Scene extends Scenes> {
  public constructor(
    protected readonly eventBus: IEventBus<Scene>,
    protected readonly store: Store<Scene>
  ) {}

  public abstract registerKeyAction(ev: RegisterKeyActionEvent<Scene>): void

  public abstract registerKeyActionListener(ev: RegisterKeyActionListenerEvent<Scene>): void
}
