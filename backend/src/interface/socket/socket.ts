import http from 'http'
import socketio from 'socket.io'
import {
  ActionEmitTypeTable,
  ActionListenTypeTable,
  SocketEmitOnlyActionType,
  SocketListenActionType,
} from './action/actionTypes'
import {
  SocketServerEmitEventRecords,
  SocketServerListenEventRecords,
  SocketListenEventType,
  SocketEventNames,
  SocketEmitEventType,
  ListenEventCallbackTable,
} from './eventTypes'
import { ActionHelper } from './action/actionHelper'
import { EventListener } from './eventListener'

export class Socket {
  private readonly actionHelper = new ActionHelper()
  private readonly eventListener: EventListener

  private readonly io: socketio.Server<
    SocketServerListenEventRecords,
    SocketServerEmitEventRecords
  >

  public constructor(server: http.Server) {
    this.io = new socketio.Server(server)
    this.eventListener = new EventListener()

    this.actionHelper.listenActionEvent(this)
    this.io.on('connection', (iosocket) => {
      console.log('connection', iosocket.id)
      this.actionHelper.addQueue(iosocket.id)

      for (const eventName of SocketEventNames) {
        iosocket.on(eventName, (...data: any[]) => {
          this.eventListener.callbacks[eventName](...data.concat([iosocket.id]))
        })
      }
    })
  }

  /**
   * socketIdで指定したプレイヤーに対してemit
   */
  public emitEventTo<Ev extends SocketEmitEventType>(
    eventName: Ev,
    socketId: string,
    ...args: Parameters<SocketServerEmitEventRecords[Ev]>
  ): void {
    this.io.to(socketId).emit(eventName, ...args)
  }

  /**
   * socketIdで指定したプレイヤーを除いた全プレイヤーに対してemit
   */
  public emitEventBroadCastFrom<Ev extends SocketEmitEventType>(
    eventName: Ev,
    socketId: string,
    ...args: Parameters<SocketServerEmitEventRecords[Ev]>
  ): void {
    void this.io.fetchSockets().then((sockets) => {
      sockets.forEach((socket) => {
        if (socket.id !== socketId) {
          socket.emit(eventName, ...args)
        }
      })
    })
  }

  /**
   * 全プレイヤーに対してemit
   */
  public emitEventBroadCast<Ev extends SocketEmitEventType>(
    eventName: Ev,
    ...args: Parameters<SocketServerEmitEventRecords[Ev]>
  ): void {
    this.io.emit(eventName, ...args)
  }

  /**
   * Action送信のため 全プレイヤーの送信キューに入れる
   */
  public emitActionBroadCast<Ac extends SocketEmitOnlyActionType>(
    actionName: Ac,
    obj: Parameters<ActionEmitTypeTable[Ac]>[0]
  ): void {
    this.actionHelper.emitAction(actionName, obj)
  }

  /**
   * Action送信のため 指定したプレイヤーの送信キューに入れる
   */
  public emitActionTo<Ac extends SocketEmitOnlyActionType>(
    playerId: string,
    actionName: Ac,
    obj: Parameters<ActionEmitTypeTable[Ac]>[0]
  ): void {
    this.actionHelper.emitActionTo(playerId, actionName, obj)
  }

  /**
   * Action送信のため 指定したプレイヤー以外の送信キューに入れる
   */
  public emitActionBroadCastFrom<Ac extends SocketEmitOnlyActionType>(
    playerId: string,
    actionName: Ac,
    obj: Parameters<ActionEmitTypeTable[Ac]>[0]
  ): void {
    this.actionHelper.emitActionWithout(playerId, actionName, obj)
  }

  /**
   * メインループのループ毎に実行される
   * 受信キューの中身を取り出してデータに応じてcallbackを実行、Clientに送信
   */
  public update(): void {
    const receiveData = this.actionHelper.getReceivedData()
    if (receiveData.length !== 0) {
      this.actionHelper.execActions(receiveData)
      this.actionHelper.storePacketsToTransmitQueue(receiveData)
    }

    const receiveEmitAllPlayersActData =
      this.actionHelper.getEmitAllPlayersActReceiveQueue()
    if (receiveEmitAllPlayersActData.length !== 0) {
      this.actionHelper.execActions(receiveEmitAllPlayersActData)
      this.actionHelper.storeEmitAllPlayersActPacketsToTransmitQueue(
        receiveEmitAllPlayersActData
      )
    }

    // receiveDataが空でもemitActionで直接送信キューに格納している場合がある
    void this.actionHelper.emitTransmitQueue(this)
  }

  /**
   * eventのlisten
   * @param eventName イベント名
   * @param callback イベント受信後のcallback
   */
  public listenEvent<Ev extends SocketListenEventType>(
    eventName: Ev,
    callback: ListenEventCallbackTable[Ev]
  ): void {
    this.eventListener.listen(eventName, callback)
  }

  /**
   * actionのlisten
   * @param actionName アクション名
   * @param callback アクション受信後のcallback
   */
  public listenAction<Ac extends SocketListenActionType>(
    actionName: Ac,
    callback: ActionListenTypeTable[Ac]
  ): void {
    this.actionHelper.listenAction(actionName, callback)
  }

  /**
   * 送信キューを削除する。プレイヤーとの通信が切断されたときに実行
   * @param socketId 削除する送信キューのid
   */
  public removeTransmitQueue(socketId: string): void {
    this.actionHelper.removeQueue(socketId)
  }
}
