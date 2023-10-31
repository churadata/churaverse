/* eslint-disable @typescript-eslint/no-empty-function */
import { SocketListenEventType, ListenEventCallbackTable } from './eventTypes'

export class EventListener {
  /**
   * Event受信時に発火する関数
   * 初期時は何もしない
   */
  public readonly callbacks: ListenEventCallbackTable = {
    enterPlayer: () => {},
    requestPreloadedData: () => {},
    checkConnect: () => {},
    emitAction: () => {},
    emitAllPlayersAction: () => {},
    disconnect: () => {},
    requestKickPlayer: () => {},
    exitOwnPlayer: () => {},
    requestNewMap: () => {},
  }

  /**
   * eventのlisten
   * @param eventName イベント名
   * @param callback イベント受信後のcallback
   */
  public listen<Ev extends SocketListenEventType>(eventName: Ev, callback: ListenEventCallbackTable[Ev]): void {
    this.callbacks[eventName] = callback
  }
}
