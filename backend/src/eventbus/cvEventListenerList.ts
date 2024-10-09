import { CVEvent } from '../event/cvEvent'
import { Scenes } from '../scene/types'
import { CVAsyncEventListener, CVEventListener } from './cvEventListener'
import { EVENT_PRIORITY, EVENT_PRIORITY_NAME, EventPriority } from './eventPriority'

/**
 * 1つのイベントのlistenerを保持するクラス
 *
 * listenerをEventPriority毎に保持し, getListenersではEventPriority順に結合したlistenerの配列を返す
 */
export class CVEventListenerList<Ev extends CVEvent<Scenes>> {
  /**
   * EventPriority毎に分けてlistenerを保持するMap
   */
  private readonly priorities = new Map<EventPriority, Array<CVEventListener<Ev> | CVAsyncEventListener<Ev>>>()
  /**
   * allPrioritiesListenerを再構築する必要がある場合はtrue
   */
  private shouldRebuild = false

  /**
   * prioritiesで保持しているlistenerをEventPriority順に結合したlistenerの配列
   */
  private allPrioritiesListener: Array<CVEventListener<Ev>> = []

  /**
   * prioritiesで保持しているlistenerをEventPriority順のlistenerの配列の配列
   */
  private dividedPrioritiesListener: Array<Array<CVEventListener<Ev>>> = []

  public constructor() {
    EVENT_PRIORITY_NAME.forEach((priorityName) => {
      this.priorities.set(EVENT_PRIORITY[priorityName], [])
    })
  }

  /**
   * listenerを追加する
   */
  public register(priority: EventPriority, listener: CVEventListener<Ev> | CVAsyncEventListener<Ev>): void {
    this.shouldRebuild = true
    this.priorities.get(priority)?.push(listener)
  }

  /**
   * 引数で受け取ったlistenerを削除する
   */
  public unregister(listener: CVEventListener<Ev>): void {
    this.shouldRebuild = true
    this.priorities.forEach((listeners, key) => {
      this.priorities.set(
        key,
        listeners.filter((_listener) => _listener !== listener)
      )
    })
  }

  /**
   * EventPriority順に並んだlistenerの配列を返す
   */
  public getListeners(): Array<CVEventListener<Ev>> {
    if (this.shouldRebuild) this.rebuild()

    return this.allPrioritiesListener
  }

  /**
   * EventPriority順に区切られたlistenerの配列を返す
   */
  public getListenersPriorityDivided(): Array<Array<CVEventListener<Ev>>> {
    if (this.shouldRebuild) this.rebuild()

    return this.dividedPrioritiesListener
  }

  /**
   * prioritiesを元にallPrioritiesListenerを作り直す
   *
   * register/unregisterでprioritiesの保持するlistenerに変化があった際にallPrioritiesListenerを作り直す
   */
  private rebuild(): void {
    this.allPrioritiesListener = EVENT_PRIORITY_NAME.flatMap((name) => {
      return this.priorities.get(name) ?? []
    })

    // EventPriority順に区切られたlistenerの配列を取得する
    this.dividedPrioritiesListener = Array.from(this.priorities.values())
    this.shouldRebuild = false
  }
}
