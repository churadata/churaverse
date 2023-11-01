import { IMegaphoneUserRepository } from '../../domain/IRepository/IMegaphoneUserRepository'
import { IPlayerRepository } from '../../domain/IRepository/IPlayerRepository'
import { Direction } from '../../domain/core/direction'
import { WorldConfig } from '../../domain/model/worldConfig'
import { EmitData, InvincibleWorldModeInfo, ReceiveData } from './action/actionTypes'

/**
 * Serverから送るEventの名前とその送受信のデータの定義
 */
export interface SocketServerEmitEventRecords {
  /**
   * サーバから送る他プレイヤーのupdate
   * emitActionと対になる
   */
  playersAct: (data: EmitData) => void

  /**
   * socket idがなくなったときにリロードする時のevent
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  NotExistsPlayer: () => void

  /**
   * 他playerの接続が終了した時のevent
   */
  disconnected: (playerId: string) => void

  /**
   * 他playerが参加してきた時のevent
   */
  newPlayer: (playerInfo: PlayerInfo) => void

  handleKickRequest: (info: RequestKickPlayerInfo) => void

  newMap: (info: MapInfo) => void
}

/**
 * Serverが受け取るEventの名前とその送受信のデータの定義
 */
export interface SocketServerListenEventRecords {
  /**
   * ログイン時に呼ばれるEvent
   */
  enterPlayer: (receiveData: ReceiveJoinData) => void

  /**
   * ログイン時に情報を取得するEvent
   */
  requestPreloadedData: (callback: (data: PreloadedData) => void) => void

  /**
   * 情報を同期するEvent
   */
  checkConnect: (callback: (data: string[]) => void) => void

  /**
   * 情報をまとめてServerに送るEvent
   */
  emitAction: (receiveData: ReceiveData) => void

  /**
   * 情報を他のClientに送るEvent
   */
  emitAllPlayersAction: (receiveData: ReceiveData) => void

  /**
   * 通信切断時に呼ばれるEvent
   */
  disconnect: (reason: string) => void

  requestKickPlayer: (receiveData: RequestKickPlayerInfo) => void

  exitOwnPlayer: (receiveData: exitOwnPlayerInfo) => void

  requestNewMap: (receiveData: MapInfo) => void
}

type DefaultListenEventCallbackArgs = [socketId: string]
type AddArgs<Func extends (...args: any) => any, AddedArgs extends [...args: any]> = (
  ...args: [...Parameters<Func>, ...AddedArgs]
) => ReturnType<Func>

/**
 * 関数の引数にDefaultListenEventCallbackArgsを追加する
 */
type ListenEventCallback<Func extends (...args: any) => any> = AddArgs<Func, DefaultListenEventCallbackArgs>

/**
 * ListenEventに渡すcallbackの型テーブル
 * SocketServerListenEventRecordsで定義された関数の引数にDefaultListenEventCallbackArgsが追加された関数
 */
export type ListenEventCallbackTable = {
  [eventName in SocketListenEventType]: ListenEventCallback<SocketServerListenEventRecords[eventName]>
}

/**
 * Clientから送られてくるEventNameの型
 */
/* eslint-disable */
export const SocketListenEventType = {
  EnterPlayer: 'enterPlayer',
  RequestPreloadedData: 'requestPreloadedData',
  CheckConnect: 'checkConnect',
  EmitAction: 'emitAction',
  EmitAllPlayersAction: 'emitAllPlayersAction',
  DisConnect: 'disconnect',
  RequestKickPlayer: 'requestKickPlayer',
  ExitOwnPlayer: 'exitOwnPlayer',
  RequestNewMap: 'requestNewMap',
} as const
export type SocketListenEventType = typeof SocketListenEventType[keyof typeof SocketListenEventType]

export const SocketEventNames = Object.values(SocketListenEventType) as SocketListenEventType[]
/* eslint-enable */
/**
 * Clientに送られるEventNameの型
 */
/* eslint-disable */
export const SocketEmitEventType = {
  PlayersAct: 'playersAct',
  NotExistsPlayer: 'NotExistsPlayer',
  Disconnected: 'disconnected',
  NewPlayer: 'newPlayer',
  HandleKickRequest: 'handleKickRequest',
  NewMap: 'newMap',
  /* eslint-enable */
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketEmitEventType = typeof SocketEmitEventType[keyof typeof SocketEmitEventType]

/**
 * Playerの情報
 */
export interface PlayerInfo {
  hp: number
  x: number
  y: number
  direction: Direction
  playerId: string
  heroColor: string
  heroName: string
}

/**
 * 存在するプレイヤーの情報
 */
export interface ExistPlayersInfo {
  [id: string]: PlayerInfo
}

/**
 * プレイヤー毎のメガホン機能の使用状況
 */
export interface MegaphoneUsersInfo {
  [id: string]: boolean
}

/**
 * PreloadedDataを作るために必要なデータ
 */
export interface PreloadedDataIngredients {
  players: IPlayerRepository
  megaphoneUsers: IMegaphoneUserRepository
  mapName: string
  worldConfig: WorldConfig
}

/**
 * Preloadedの段階で取得する情報
 */
export interface PreloadedData {
  existPlayers: ExistPlayersInfo
  megaphoneUsers: MegaphoneUsersInfo
  mapName: string
  invincibleWorldModeInfo: InvincibleWorldModeInfo
}

/**
 * 入室する際に受け取るデータ
 */
export interface ReceiveJoinData {
  playerInfo: PlayerInfo
}

/**
 * キックする際に受け渡しするデータ
 */
export interface RequestKickPlayerInfo {
  kickedId: string
  kickerId: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface exitOwnPlayerInfo {
  playerId: string
}

export interface MapInfo {
  mapName: string
}
