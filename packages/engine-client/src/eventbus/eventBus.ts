import type { CVEventMap, CVEventType } from '../event/events'
import type { Scenes } from '../scene/types'
import type { CVAsyncEventListener, CVEventListener } from './cvEventListener'
import { CVEventListenerHelper } from './cvEventListenerHelper'
import { EVENT_PRIORITY, type EventPriority } from './eventPriority'
import type { IEventBus } from './IEventBus'

export class EventBus<Scene extends Scenes> implements IEventBus<Scene> {
  private readonly eventListenerHelper = new CVEventListenerHelper<Scene>()

  public subscribeEvent<EvType extends CVEventType<Scene> & string>(
    type: EvType,
    listener: CVEventListener<CVEventMap<Scene>[EvType]> | CVAsyncEventListener<CVEventMap<Scene>[EvType]>,
    priority: EventPriority = EVENT_PRIORITY.NORMAL
  ): void {
    const listenerList = this.eventListenerHelper.getListenerList<EvType>(type)
    listenerList.register(priority, listener)
  }

  public unsubscribeEvent<EvType extends CVEventType<Scene> & string>(
    type: EvType,
    listener: CVEventListener<CVEventMap<Scene>[EvType]>
  ): void {
    const listenerList = this.eventListenerHelper.getListenerList<EvType>(type)
    listenerList.unregister(listener)
  }

  public post(event: CVEventMap<Scene>[string]): void {
    for (const listener of this.getListeners(event.type)) {
      if (event.isCanceled) break
      listener(event)
    }
  }

  public async asyncPost(event: CVEventMap<Scene>[string]): Promise<void> {
    for (const listeners of this.getListenersByPriority(event.type)) {
      if (event.isCanceled) break

      await Promise.all(listeners.map(async (listener) => await Promise.resolve(listener(event))))
    }
  }

  private getListeners(type: string): Array<CVEventListener<CVEventMap<Scene>[string]>> {
    return this.eventListenerHelper.getListenerList(type).getListeners()
  }

  private getListenersByPriority(type: string): Array<Array<CVEventListener<CVEventMap<Scene>[string]>>> {
    return this.eventListenerHelper.getListenerList(type).getListenersPriorityDivided()
  }

  /**
   * 全イベントのlistenerを全て削除する.Sceneの初期化時に実行する
   */
  public deleteAllListeners(): void {
    this.eventListenerHelper.deleteAllListenerList()
  }
}
