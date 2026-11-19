import type { IEventBus } from '../../../eventbus/IEventBus'
import type { Scenes } from '../../../scene/types'
import type { Store } from '../../../store/store'

/**
 * constructor→loading→listenEventの順に実行される. 各pluginのloadingは非同期的に実行され, 全てのpluginのloadingが完了してからlistenEventが実行される
 */
export abstract class BasePlugin<Scene extends Scenes> {
  public constructor(
    protected readonly store: Store<Scene>,
    protected readonly bus: IEventBus<Scene>
  ) {}
  public async loading(): Promise<void> {}
  public abstract listenEvent(): void
}
