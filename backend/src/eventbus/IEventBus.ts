import { CVEventMap, CVEventType } from '../event/events'
import { Scenes } from '../scene/types'
import { CVAsyncEventListener, CVEventListener } from './cvEventListener'
import { EventPriority } from './eventPriority'

export interface IEventBus<Scene extends Scenes> {
  /**
   * イベントがpostされた時に実行されるlistener(callback)を登録する.
   *
   * 同じイベントに対して複数のlistenerが登録された場合の実行順はEVENT_PRIORITYによって決定する. EVENT_PRIORITY.HIGHESTが一番先に実行され、EVENT_PRIORITY.LOWESTが一番最後に実行される.
   * EVENT_PRIORITYも同じ場合はsubscribeEventを実行した順番でlistenerが実行される.
   *
   * @param type イベント名
   * @param listener typeで指定したイベントがpostされた時に実行される関数
   * @param priority 同じイベントに対して複数のlistenerが登録されていた場合の実行順序の優先度
   */
  subscribeEvent: <EvType extends CVEventType<Scene>>(
    type: EvType,
    listener: CVEventListener<CVEventMap<Scene>[EvType]> | CVAsyncEventListener<CVEventMap<Scene>[EvType]>,
    priority?: EventPriority
  ) => void

  /**
   * イベントを発火する. subscribeEventで登録したlistenerが実行される.
   * @param event 発火するイベント
   */
  post: (event: CVEventMap<Scene>[string]) => void

  /**
   * イベントを発火する. subscribeEventで登録したlistenerが優先度ごとにawait実行される.
   * @param event
   * @returns Promise<void>
   */
  asyncPost: (event: CVEventMap<Scene>[string]) => Promise<void>
}
