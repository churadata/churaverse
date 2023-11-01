import { ActionTypeTable, SocketEmitActionType, SocketListenActionType } from '../../../interface/socket/actionTypes'
import { SocketClientListenEventRecords, SocketListenEventType } from '../../../interface/socket/eventTypes'

export type SocketListenSceneName = 'Universal' | 'Title' | 'Main'

export interface ISocket {
  /**
   * eventのlisten
   * @param eventName イベント名
   * @param callback イベント受信後のcallback
   */
  listenEvent: <Ev extends SocketListenEventType>(
    eventName: Ev,
    callback: SocketClientListenEventRecords[Ev],
    listenScene?: SocketListenSceneName | undefined
  ) => void

  listenAction: <Ac extends SocketEmitActionType | SocketListenActionType>(
    actionName: Ac,
    callback: ActionTypeTable[Ac],
    listenScene?: SocketListenSceneName | undefined
  ) => void

  /**
   * 時間が最後のemitから制限時間より経過したか
   * @param LimitMs 制限時間
   * @returns 超過したかどうか
   */
  isTimeExceedingLastEmit: (LimitMs: number) => boolean
}
