import { io, Socket as ioSocket } from 'socket.io-client'
import { EventNames } from 'socket.io/dist/typed-events'
import { ActionHelper } from './actionHelper'
import { ActionEmitTypeTable, ActionTypeTable, SocketEmitActionType, SocketListenActionType } from './actionTypes'
import { SocketClientListenEventRecords, SocketClientEmitEventRecords, SocketListenEventType } from './eventTypes'
import { ISocket, SocketListenSceneName } from '../../adapter/controller/socket/ISocket'
import { CallbackExecutionGuard } from '../../adapter/controller/socket/callbackExecutionGuard'

/**
 * Serverとの通信用クラス
 */
export class Socket implements ISocket {
  // 最後にemitしたepoch time
  private lastEmitTime = Date.now()

  private readonly actionHelper = new ActionHelper(this)
  private static instance: Socket

  private constructor(
    private readonly callbackExecutionGuard: CallbackExecutionGuard,
    // ioSocket<ListenRecords, EmitRecords> の並びです
    // https://socket.io/docs/v4/migrating-from-3-x-to-4-0/#typed-events
    private readonly iosocket: ioSocket<SocketClientListenEventRecords, SocketClientEmitEventRecords>
  ) {}

  public static async build(CallbackExecutionGuard: CallbackExecutionGuard): Promise<Socket> {
    if (Socket.instance !== undefined) {
      return Socket.instance
    }
    // スキーマが含まれているか確認
    const regexpUrlHasScheme = /^.+:\/\//

    const urlStr = regexpUrlHasScheme.test(import.meta.env.VITE_BACKEND_URL)
      ? // true
        import.meta.env.VITE_BACKEND_URL
      : // false
        'http://' + import.meta.env.VITE_BACKEND_URL

    const url = new URL(urlStr)

    return await new Promise<ioSocket>((resolve) => {
      const ioSocket = io(url.host, {
        // 最後が/で終わるときはpathを置き換え
        path: url.pathname.replace(/\/$/, '') + '/socket.io/',
      })
      ioSocket.on('connect', () => {
        resolve(ioSocket)
      })
    }).then((ioSocket) => {
      Socket.instance = new Socket(CallbackExecutionGuard, ioSocket)
      return Socket.instance
    })
  }

  /**
   * socket idを返す関数
   */
  public get socketId(): string {
    return this.iosocket.id
  }

  /**
   * Event送信
   * @param eventName
   * @param args 引数
   */
  public emitEvent<Ev extends EventNames<SocketClientEmitEventRecords>>(
    eventName: Ev,
    ...args: Parameters<SocketClientEmitEventRecords[Ev]>
  ): void {
    this.iosocket.emit(eventName, ...args)
    // 最後の送信時刻の更新
    this.lastEmitTime = Date.now()
  }

  /**
   * Action送信のため bufferに入れる
   * @param actionName
   * @param obj bufferにはいるデータ
   */
  public emitAction<Ac extends SocketEmitActionType>(
    actionName: Ac,
    obj: Parameters<ActionEmitTypeTable[Ac]>[0]
  ): void {
    this.actionHelper.emitAction(actionName, obj)
  }

  /**
   * bufferの中身を送る
   */
  public emitBufferd(): void {
    this.actionHelper.emitBuffered(this, this.iosocket.id)
  }

  /**
   * 時間が最後のemitから制限時間より経過したか
   * @param LimitMs 制限時間
   * @returns 超過したかどうか
   */
  public isTimeExceedingLastEmit(LimitMs: number): boolean {
    return Date.now() - this.lastEmitTime > LimitMs
  }

  /**
   * eventのlisten
   * @param eventName イベント名
   * @param callback イベント受信後のcallback
   */
  public listenEvent<Ev extends SocketListenEventType>(
    eventName: Ev,
    callback: SocketClientListenEventRecords[Ev],
    listenScene?: SocketListenSceneName
  ): void {
    const actualListenScene = listenScene ?? 'Main'
    this.iosocket.removeAllListeners(eventName)
    // 対処は可能ですが,
    // ここの変更忘れで時間をかけそうなので無視することにしました
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.iosocket.on(eventName, (...arg) => {
      if (this.callbackExecutionGuard.isCurrentScene(actualListenScene)) {
        // @ts-expect-error
        // eslint-disable-next-line n/no-callback-literal
        callback(...arg)
      }
    })
  }

  public listenAction<Ac extends SocketEmitActionType | SocketListenActionType>(
    actionName: Ac,
    callback: ActionTypeTable[Ac],
    listenScene?: SocketListenSceneName
  ): void {
    const actualListenScene = listenScene ?? 'Main'
    // @ts-expect-error
    this.actionHelper.listenAction(actionName, (...arg) => {
      if (this.callbackExecutionGuard.isCurrentScene(actualListenScene)) {
        // @ts-expect-error
        // eslint-disable-next-line n/no-callback-literal
        callback(...arg)
      }
    })
  }
}
