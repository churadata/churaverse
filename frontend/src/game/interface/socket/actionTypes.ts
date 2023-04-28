import { Vector } from 'matter'
import { Direction } from '../../domain/direction'
import { PlayerColorName } from '../../domain/model/types'

/**
 * 受け取るaction名とデータの型の対応表
 */
export interface ActionTypeTable {
  turn: (data: TurnInfo & RecieveBaseInfo) => void
  walk: (data: WalkInfo & RecieveBaseInfo) => void
  stop: (data: StopInfo & RecieveBaseInfo) => void
  profile: (data: ProfileInfo & RecieveBaseInfo) => void
  shark: (data: SharkInfo & RecieveBaseInfo) => void
  bomb: (data: BombInfo & RecieveBaseInfo) => void
  chat: (data: ChatInfo & RecieveBaseInfo) => void
  ownPlayerDie: (data: PlayerDieInfo) => void
  otherPlayerDie: (data: PlayerDieInfo) => void
  damage: (data: PlayerDamageInfo) => void
  hitShark: (data: SharkDestroyInfo) => void
  ownPlayerRespawn: (data: PlayerRespawnInfo) => void
  otherPlayerRespawn: (data: PlayerRespawnInfo) => void
}

/**
 * 送るaction名とデータの型の対応表
 */
export interface ActionEmitTypeTable {
  turn: (data: TurnInfo) => void
  walk: (data: WalkInfo) => void
  stop: (data: StopInfo) => void
  profile: (data: ProfileInfo) => void
  shark: (data: SharkInfo) => void
  bomb: (data: BombInfo) => void
  chat: (data: ChatInfo) => void
}

/**
 * 受け取りだけのaction名
 */
export const SocketListenActionType = {
  OwnPlayerDie: 'ownPlayerDie',
  OtherPlayerDie: 'otherPlayerDie',
  Damage: 'damage',
  HitShark: 'hitShark',
  OwnPlayerRespawn: 'ownPlayerRespawn',
  OtherPlayerRespawn: 'otherPlayerRespawn',
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketListenActionType = typeof SocketListenActionType[keyof typeof SocketListenActionType]

/**
 * 他のactionと一緒に送られるaction名
 */
export const SocketNormalActionType = {
  Turn: 'turn',
  Walk: 'walk',
  Stop: 'stop',
  Profile: 'profile',
  Shark: 'shark',
  Bomb: 'bomb',
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketNormalActionType = typeof SocketNormalActionType[keyof typeof SocketNormalActionType]

export const SocketNormalActionNames = Object.values(SocketNormalActionType) as SocketNormalActionType[]

/**
 * 会話用のaction名
 */
export const SocketChattableActionType = {
  Chat: 'chat',
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketChattableActionType = typeof SocketChattableActionType[keyof typeof SocketChattableActionType]

// 要素がchatの1つのためtype assertionが不要だが, 書き方の統一のためにsuppress
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const SocketChattableActionNames = Object.values(SocketChattableActionType) as SocketChattableActionType[]

/**
 * 送るだけのaction名
 */
export const SocketEmitActionType = { ...SocketNormalActionType, ...SocketChattableActionType }
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketEmitActionType = typeof SocketEmitActionType[keyof typeof SocketEmitActionType]

/**
 * まとめて送るときの型
 */
export interface EmitData {
  id: string
  actions: Array<EmitOnlyAction<SocketEmitActionType>>
}

/**
 * サーバからまとめて送られてきたときの型
 */
export type RecieveData = Array<RecieveOnlyAction<SocketEmitActionType | SocketListenActionType>>

/**
 * アクションの型
 */
export interface EmitOnlyAction<Type extends SocketEmitActionType> {
  type: Type
  infos: Array<Parameters<ActionEmitTypeTable[Type]>[0] & BaseInfo>
}

export interface RecieveOnlyAction<Type extends SocketEmitActionType | SocketListenActionType> {
  type: Type
  info: Parameters<ActionTypeTable[Type]>[0]
}

/**
 * 格納されるアクションに付属するプロパティ
 */
export interface BaseInfo {
  /** emitAction時の現在時間 */
  _emitTime: number
}

/**
 * 受信時に必ず含まれるプロパティ
 */
export interface RecieveBaseInfo {
  id: string
  /** emitAction時の現在時間 */
  _emitTime: number
}

/**
 * profile変更時に送信するための型
 */
export interface ProfileInfo {
  heroColor: PlayerColorName
  heroName: string
  direction: Direction
}

/**
 * playerが歩いてるときの状態を送信するための型
 */
export interface WalkInfo {
  startPos: Vector
  direction: Direction
  speed: number
}

/**
 * playerの歩行が停止したことを送信するための型
 */
export interface StopInfo {
  stopPos: Vector
  direction: Direction
}

/**
 * playerが方向転換したことを送信するための型
 */
export interface TurnInfo {
  direction: Direction
}

/**
 * player被弾時に受信するための型
 */
export interface PlayerDamageInfo {
  attacker: string
  target: string
  cause: string
  damage: number
}

/**
 * player死亡時に受信するための型
 */
export interface PlayerDieInfo {
  id: string
}

/**
 * player復活時に受信するための型
 */
export interface PlayerRespawnInfo {
  id: string
  respawnPos: { x: number; y: number; direction: Direction }
}

/**
 * shark生成時に送信するための型
 */
export interface SharkInfo {
  sharkId: string
  startPos: Vector
  direction: Direction
}

/**
 * shark破棄時に受信するための型
 */
export interface SharkDestroyInfo {
  sharkId: string
}

/**
 * bomb生成時に送信するための型
 */
export interface BombInfo {
  bombId: string
  position: { x: number; y: number }
}

/**
 * チャット送信するための型
 * 名前は考え直したい
 */
export interface ChatInfo {
  name: string
  message: string
}
