import {
  SocketEmitOnlyActionType,
  ActionFromServer,
  EmitData,
} from '../actionTypes'

// バックエンド側で送信先の振り分けを行う場合と行わない場合で分離

// 振り分けを行わない場合
// eslint-disable-next-line import/export
export interface ITransmitQueue {
  push: (sendData: EmitData) => void
  // pop: () => EmitData[]
}

// 振り分けを行う場合 (送信キューをプレイヤー毎に分ける)
export type TransmitQueueBuffers = Map<string, EmitData>

/**
 * 送信するActionデータを格納する.
 * メインループのループ毎に受信キューから取り出されたデータが送信用に加工され、送信キューに格納される.
 * 格納されるデータはプレイヤー毎に分けられ、キュー内のデータが各プレイヤーにそれぞれemitされる
 */
// eslint-disable-next-line import/export
export interface ITransmitQueue {
  push: (sendData: EmitData) => void // 全送信キューに送信パケットをpush
  pop: () => Promise<TransmitQueueBuffers> // 全送信キューから送信パケットをpop
  pushAt: (playerId: string, sendData: EmitData) => void
  popAt: (playerId: string) => EmitData
  addQueue: (playerId: string) => void // 送信キューを追加
  removeQueue: (playerId: string) => void // 引数で指定した送信キューを削除
  getDestination: () => string[] // socketId(=playerId)一覧を取得

  // ActionDataを直接全プレイヤーの送信キューに追加（pushの場合は送信パケットを送信キューに追加）
  insert: <T extends SocketEmitOnlyActionType>(
    sendActionData: ActionFromServer<T>
  ) => void
  insertAt: <T extends SocketEmitOnlyActionType>(
    playerId: string,
    sendActionData: ActionFromServer<T>
  ) => void
  insertWithout: <T extends SocketEmitOnlyActionType>(
    playerId: string,
    sendActionData: ActionFromServer<T>
  ) => void
}
