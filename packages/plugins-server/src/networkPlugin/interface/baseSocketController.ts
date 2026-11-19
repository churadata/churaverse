import type { IEventBus, Scenes, Store } from 'churaverse-engine-server'
import type { RegisterMessageEvent } from '../event/registerMessageEvent'
import type { RegisterMessageListenerEvent } from '../event/registerMessageListenerEvent'

export abstract class BaseSocketController<Scene extends Scenes> {
  public constructor(
    protected readonly eventBus: IEventBus<Scene>,
    protected readonly store: Store<Scene>
  ) {}

  public registerMessage(_ev: RegisterMessageEvent<Scene>): void {}

  public registerMessageListener(_ev: RegisterMessageListenerEvent<Scene>): void {}
}
