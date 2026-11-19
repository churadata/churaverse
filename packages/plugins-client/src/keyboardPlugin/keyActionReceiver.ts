import type { Scenes } from 'churaverse-engine-client'
import type { IKeyActionListener } from './interface/IKeyActionListener'
import type { KeyActionType } from './keyAction/keyActions'
import type { KeyActionListenerList } from './keyActionListenerList'

export class KeyActionReceiver<Scene extends Scenes> {
  private readonly listenersMap = new Map<KeyActionType<Scene>, KeyActionListenerList>()

  public on<KeyActType extends KeyActionType<Scene> & string>(type: KeyActType, listener: IKeyActionListener): void {
    if (!this.listenersMap.has(type)) {
      this.listenersMap.set(type, [])
    }

    this.listenersMap.get(type)?.push(listener)
  }

  public off<KeyActType extends KeyActionType<Scene> & string>(type: KeyActType, listener: IKeyActionListener): void {
    const listeners = this.listenersMap.get(type)
    if (listeners === undefined) return
    const index = listeners.indexOf(listener)
    if (index !== -1) {
      listeners.splice(index, 1)
    }
  }

  /**
   * on()で追加したlistenerを返す
   */
  public getListenerList<KeyActType extends KeyActionType<Scene> & string>(type: KeyActType): KeyActionListenerList {
    return this.listenersMap.get(type) ?? []
  }

  /**
   * typeで指定したlistenersを実行
   */
  public execListeners<KeyActType extends KeyActionType<Scene> & string>(type: KeyActType): void {
    this.getListenerList(type).forEach((listener) => {
      listener()
    })
  }
}
