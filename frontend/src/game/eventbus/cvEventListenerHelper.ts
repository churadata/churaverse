import { CVEventMap } from '../event/events'
import { Scenes } from '../scene/types'
import { CVEventListenerList } from './cvEventListenerList'

export class CVEventListenerHelper<Scene extends Scenes> {
  private listenerListMap = new Map<keyof CVEventMap<Scene>, CVEventListenerList<any>>()

  public getListenerList<EvType extends keyof CVEventMap<Scene>>(
    type: EvType
  ): CVEventListenerList<CVEventMap<Scene>[EvType]> {
    let listenerList: CVEventListenerList<CVEventMap<Scene>[EvType]> | undefined = this.listenerListMap.get(type)

    // まだ一度もsubscribeEvent()でlistenerが登録されていないイベントの場合はlistenerListがないので空のlistenerListを追加する
    if (listenerList === undefined) {
      const defaultListenerList = new CVEventListenerList<CVEventMap<Scene>[EvType]>()
      this.listenerListMap.set(type, defaultListenerList)
      listenerList = defaultListenerList
    }

    return listenerList
  }

  /**
   * 全イベントの全listenerを削除
   */
  public deleteAllListenerList(): void {
    this.listenerListMap = new Map()
  }
}
