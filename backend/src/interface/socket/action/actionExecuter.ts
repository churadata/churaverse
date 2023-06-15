/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ReceiveBaseInfo,
  SocketListenActionType,
  ActionListenTypeTable,
  BombInfo,
  ChatInfo,
  ProfileInfo,
  SharkInfo,
  TurnInfo,
  WalkInfo,
  StopInfo,
  MegaphoneInfo,
} from './actionTypes'

/**
 * Action受信時にActionに応じてlistenActionで設定したcallbackを実行する
 */
export class ActionExecuter {
  /**
   * Action受信時に発火する関数
   * 初期時は何もしない
   */
  private readonly listenCallbacks: ActionListenTypeTable = {
    turn: (data: TurnInfo & ReceiveBaseInfo) => {},
    walk: (data: WalkInfo & ReceiveBaseInfo) => {},
    stop: (data: StopInfo & ReceiveBaseInfo) => {},
    profile: (data: ProfileInfo & ReceiveBaseInfo) => {},
    shark: (data: SharkInfo & ReceiveBaseInfo) => {},
    bomb: (data: BombInfo & ReceiveBaseInfo) => {},
    chat: (data: ChatInfo & ReceiveBaseInfo) => {},
    megaphone: (data: MegaphoneInfo & ReceiveBaseInfo) => {},
  }

  /**
   * action受信時のコールバックを登録する関数
   * @param actionName socketが受信したaction
   * @param f 発火する関数
   */
  public registerCallback<K extends SocketListenActionType>(
    actionName: K,
    f: ActionListenTypeTable[K]
  ): void {
    this.listenCallbacks[actionName] = f
  }

  /**
   * listenActionで設定したcallbackを実行
   */
  public exec<K extends SocketListenActionType>(
    actionName: K,
    data: Parameters<ActionListenTypeTable[K]>[0]
  ): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.listenCallbacks[actionName](data)
  }
}
