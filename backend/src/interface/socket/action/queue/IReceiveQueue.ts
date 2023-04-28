import { ReceiveData } from '../actionTypes'

/**
 * 受信キュー
 * SocketListenEventType.EmitActionで受信したActionデータが格納される
 */
export interface IReceiveQueue {
  push: (receivedData: ReceiveData) => void
  pop: () => ReceiveData[]
}
