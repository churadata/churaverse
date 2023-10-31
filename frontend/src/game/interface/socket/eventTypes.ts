import { Direction } from '../../domain/model/core/direction'
import { PlayerColorName, PlayerRoleName } from '../../domain/model/types'
import { EmitData, InvincibleWorldModeInfo, RecieveData } from './actionTypes'

/**
 * Clientから送るEventの名前とその送受信のデータの定義
 * なおSocket.ioに組み込まれたイベントは認識していないため定義すること
 * 参考リンク: https://labs.gree.jp/blog/2019/02/17785/
 */
export interface SocketClientEmitEventRecords {
  /**
   * ログイン時に呼ばれるEvent
   */
  enterPlayer: (emitData: EmitJoinData) => void

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
  emitAction: (emitData: EmitData) => void

  /**
   * 情報を他のClientに送るEvent
   */
  emitAllPlayersAction: (emitData: EmitData) => void

  requestKickPlayer: (emitData: KickPlayerInfo) => void

  exitOwnPlayer: (emitData: exitOwnPlayerInfo) => void

  requestNewMap: (emitData: MapInfo) => void
}

/**
 * Clientが受け取るEventの名前とその送受信のデータの定義
 * 参考リンク: https://labs.gree.jp/blog/2019/02/17785/
 */
export interface SocketClientListenEventRecords {
  /**
   * サーバから送られてくる他プレイヤーのupdate
   * emitActionと対になる
   */
  playersAct: (data: RecieveData) => void

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

  handleKickRequest: (info: KickPlayerInfo) => void

  newMap: (info: MapInfo) => void
}

/**
 * Serverに送られるEventNameの型
 */
/* eslint-disable */
export const SocketEmitEventType = {
  EnterPlayer: 'enterPlayer',
  RequestPreloadedData: 'requestPreloadedData',
  CheckConnect: 'checkConnect',
  EmitAction: 'emitAction',
  EmitAllPlayersAction: 'emitAllPlayersAction',
  RequestKickPlayer: 'requestKickPlayer',
  ExitOwnPlayer: 'exitOwnPlayer',
  RequestNewMap: 'requestNewMap',
} as const
/* eslint-enable */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketEmitEventType = typeof SocketEmitEventType[keyof typeof SocketEmitEventType]

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SocketEmitEventNames = Object.values(SocketEmitEventType) as SocketEmitEventType[]

/**
 * Serverから送られてくるEventNameの型
 */
/* eslint-disable */
export const SocketListenEventType = {
  PlayersAct: 'playersAct',
  NotExistsPlayer: 'NotExistsPlayer',
  Disconnected: 'disconnected',
  NewPlayer: 'newPlayer',
  HandleKickRequest: 'handleKickRequest',
  NewMap: 'newMap',
} as const
/* eslint-enable */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketListenEventType = typeof SocketListenEventType[keyof typeof SocketListenEventType]

/**
 * Playerの情報
 */
export interface PlayerInfo {
  hp: number
  x: number
  y: number
  direction: Direction
  playerId: string
  heroColor: PlayerColorName
  heroName: string
  role: PlayerRoleName
}

/**
 * 存在するプレイヤーの情報
 */
interface ExistPlayersInfo {
  [id: string]: PlayerInfo
}

/**
 * メガホン機能をONにしているプレイヤーの情報
 */
export interface MegaphoneUsersInfo {
  [id: string]: boolean
}

/**
 * Preloadedの段階で取得する情報
 */
interface PreloadedData {
  existPlayers: ExistPlayersInfo
  megaphoneUsers: MegaphoneUsersInfo
  mapName: string
  invincibleWorldModeInfo: InvincibleWorldModeInfo
}
/**
 * 入室する際に送るデータ
 */
export interface EmitJoinData {
  playerInfo: PlayerInfo
}
/**
 * キックする際に送るデータ
 */
export interface KickPlayerInfo {
  kickedId: string
  kickerId: string
}

/**
 * 退出する際に送るデータ
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface exitOwnPlayerInfo {
  playerId: string
}

/**
 * 変更するMapデータ
 */
export interface MapInfo {
  mapName: string
}
