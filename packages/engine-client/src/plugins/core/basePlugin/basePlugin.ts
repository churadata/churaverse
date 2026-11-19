import type { IEventBus } from '../../../eventbus/IEventBus'
import type { Scenes } from '../../../scene/types'
import type { Store } from '../../../store/store'

export abstract class BasePlugin<Scene extends Scenes> {
  public constructor(
    protected readonly store: Store<Scene>,
    protected readonly bus: IEventBus<Scene>,
    protected readonly sceneName: Scene['sceneName']
  ) {}
  public abstract listenEvent(): void
}
