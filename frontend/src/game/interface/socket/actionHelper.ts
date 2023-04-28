import { SocketBuffer } from './buffer'
import { SocketListenEventType, SocketEmitEventType } from './eventTypes'
import {
  TurnInfo,
  BaseInfo,
  StopInfo,
  WalkInfo,
  ProfileInfo,
  SharkInfo,
  BombInfo,
  ChatInfo,
  EmitData,
  ActionEmitTypeTable,
  RecieveBaseInfo,
  PlayerDieInfo,
  PlayerDamageInfo,
  SharkDestroyInfo,
  PlayerRespawnInfo,
  ActionTypeTable,
  SocketNormalActionNames,
  SocketChattableActionNames,
  SocketEmitActionType,
  SocketListenActionType,
  EmitOnlyAction,
} from './actionTypes'
import { Socket } from './socket'
import { BufferType } from './types'

/**
 * actionの送受信をする
 */
export class ActionHelper {
  public constructor(socket: Socket) {
    /**
     * 受け取ったactionをcallbackに渡している
     */
    socket.listenEvent(SocketListenEventType.PlayersAct, (data) => {
      data.forEach((action) => {
        // 対処は可能ですが,
        // ここの変更忘れで時間をかけそうなので無視することにしました
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.listenCallbacks[action.type](action.info)
      })
    })
  }

  // バッファの初期化.
  // 先に宣言するほどバックエンド側で先にListenされる
  private readonly buffers = new Map([
    [SocketEmitActionType.Turn, new SocketBuffer<TurnInfo & BaseInfo>(BufferType.LastOnly)],
    // 移動キー長押し時にStop→次のWalkとemitされるのでStopからListenされる必要がある
    [SocketEmitActionType.Stop, new SocketBuffer<StopInfo & BaseInfo>(BufferType.LastOnly)],
    [SocketEmitActionType.Walk, new SocketBuffer<WalkInfo & BaseInfo>(BufferType.LastOnly)],
    [SocketEmitActionType.Profile, new SocketBuffer<ProfileInfo & BaseInfo>(BufferType.LastOnly)],
    [SocketEmitActionType.Shark, new SocketBuffer<SharkInfo & BaseInfo>(BufferType.Queue)],
    [SocketEmitActionType.Bomb, new SocketBuffer<BaseInfo & BaseInfo>(BufferType.Queue)],
    [SocketEmitActionType.Chat, new SocketBuffer<ChatInfo & BaseInfo>(BufferType.Queue)],
  ])

  /**
   * bufferの中身を送る
   */
  public emitBuffered(socket: Socket, ioSocketId: string): void {
    void Promise.any([this.emitCombinable(socket, ioSocketId), this.emitBroadcast(socket, ioSocketId)]).catch(() => {})
  }

  /**
   * serverにbufferの中身を1つにまとめて送る
   */
  private async emitCombinable(socket: Socket, ioSocketId: string): Promise<void> {
    return await new Promise((resolve, reject) => {
      // buffersの中に他clientに送るデータが無い場合return
      let hasData = false
      this.buffers.forEach((buffer, actionName) => {
        hasData ||= SocketNormalActionNames.some((s) => s === actionName) && buffer.hasData()
      })
      if (!hasData) {
        reject(new Error('NO_DATA'))
        return
      }

      const actions: Array<EmitOnlyAction<SocketEmitActionType>> = []
      this.buffers.forEach((buffer, actionName) => {
        if (!SocketNormalActionNames.some((s) => s === actionName)) return
        if (!buffer.hasData()) return

        actions.push({
          type: actionName,
          // forEachで各Actionの型が失われるのでasで補填
          infos: buffer.getData() as Array<Parameters<ActionEmitTypeTable[typeof actionName]>[0] & BaseInfo>,
        })
      })

      const formattedData: EmitData = {
        id: ioSocketId,
        actions,
      }

      socket.emitEvent(SocketEmitEventType.EmitAction, formattedData)
      // bufferの中身削除
      this.buffers.forEach((buffer, actionName) => {
        if (!SocketNormalActionNames.some((s) => s === actionName)) return
        buffer.remove()
      })
      resolve()
    })
  }

  /**
   * 他clientにbufferの中身を1つにまとめて送る
   */
  private async emitBroadcast(socket: Socket, ioSocketId: string): Promise<void> {
    return await new Promise((resolve, reject) => {
      // buffersの中に他clientに送るデータが無い場合return
      let hasData = false
      this.buffers.forEach((buffer, actionName) => {
        hasData ||= SocketChattableActionNames.some((s) => s === actionName) && buffer.hasData()
      })
      if (!hasData) {
        reject(new Error('NO_DATA'))
        return
      }

      const actions: Array<EmitOnlyAction<SocketEmitActionType>> = []
      this.buffers.forEach((buffer, actionName) => {
        if (!SocketChattableActionNames.some((s) => s === actionName)) return
        if (!buffer.hasData()) return

        actions.push({
          type: actionName,
          // forEachで各Actionの型が失われるのでasで補填
          infos: buffer.getData() as Array<Parameters<ActionEmitTypeTable[typeof actionName]>[0] & BaseInfo>,
        })
      })

      const formattedData: EmitData = {
        id: ioSocketId,
        actions,
      }

      socket.emitEvent(SocketEmitEventType.EmitAllPlayersAction, formattedData)

      // bufferの中身削除
      this.buffers.forEach((buffer, actionName) => {
        if (!SocketChattableActionNames.some((s) => s === actionName)) return
        buffer.remove()
      })
      resolve()
    })
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
    this.buffers.get(actionName)?.addData({ ...obj, _emitTime: Date.now() })
  }

  /**
   * Action受信時に発火する関数
   * 初期時は何もしない
   */
  private readonly listenCallbacks = {
    turn: (data: TurnInfo & RecieveBaseInfo) => {},
    walk: (data: WalkInfo & RecieveBaseInfo) => {},
    stop: (data: StopInfo & RecieveBaseInfo) => {},
    profile: (data: ProfileInfo & RecieveBaseInfo) => {},
    shark: (data: SharkInfo & RecieveBaseInfo) => {},
    bomb: (data: BombInfo & RecieveBaseInfo) => {},
    chat: (data: ChatInfo & RecieveBaseInfo) => {},
    ownPlayerDie: (data: PlayerDieInfo) => {},
    otherPlayerDie: (data: PlayerDieInfo) => {},
    damage: (data: PlayerDamageInfo) => {},
    hitShark: (data: SharkDestroyInfo) => {},
    ownPlayerRespawn: (data: PlayerRespawnInfo) => {},
    otherPlayerRespawn: (data: PlayerRespawnInfo) => {},
  }

  /**
   * actionをlistenする関数
   * @param actionName socketが受信したaction
   * @param f 発火する関数
   */
  public listenAction<K extends SocketEmitActionType | SocketListenActionType>(
    actionName: K,
    f: ActionTypeTable[K]
  ): void {
    this.listenCallbacks[actionName] = f
  }
}
