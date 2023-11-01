import { Direction } from '../../../domain/core/direction'
import { Vector } from '../../../domain/core/vector'
import { DamageCause } from '../../../domain/model/deathLog'

export interface ActionEmitTypeTable {
  turn: (data: TurnInfo & EmitBaseInfo) => void
  walk: (data: WalkInfo & EmitBaseInfo) => void
  stop: (data: StopInfo & EmitBaseInfo) => void
  profile: (data: ProfileInfo & EmitBaseInfo) => void
  shark: (data: SharkInfo & EmitBaseInfo) => void
  bomb: (data: BombInfo & EmitBaseInfo) => void
  chat: (data: ChatInfo & EmitBaseInfo) => void
  megaphone: (data: MegaphoneInfo & EmitBaseInfo) => void
  invincibleWorldMode: (data: InvincibleWorldModeInfo & EmitBaseInfo) => void
  ownPlayerDie: (data: PlayerDieInfo) => void
  otherPlayerDie: (data: PlayerDieInfo) => void
  damage: (data: PlayerDamageInfo) => void
  hitShark: (data: SharkDestroyInfo) => void
  ownPlayerRespawn: (data: PlayerRespawnInfo) => void
  otherPlayerRespawn: (data: PlayerRespawnInfo) => void
}

export interface ActionListenTypeTable {
  turn: (data: TurnInfo & ReceiveBaseInfo) => void
  walk: (data: WalkInfo & ReceiveBaseInfo) => void
  stop: (data: StopInfo & ReceiveBaseInfo) => void
  profile: (data: ProfileInfo & ReceiveBaseInfo) => void
  shark: (data: SharkInfo & ReceiveBaseInfo) => void
  bomb: (data: BombInfo & ReceiveBaseInfo) => void
  chat: (data: ChatInfo & ReceiveBaseInfo) => void
  megaphone: (data: MegaphoneInfo & ReceiveBaseInfo) => void
  invincibleWorldMode: (data: InvincibleWorldModeInfo & ReceiveBaseInfo) => void
}

/**
 * Server側からのみ送信するAction
 */
/* eslint-disable */
export const SocketEmitOnlyActionType = {
  OwnPlayerDie: 'ownPlayerDie',
  OtherPlayerDie: 'otherPlayerDie',
  Damage: 'damage',
  HitShark: 'hitShark',
  OwnPlayerRespawn: 'ownPlayerRespawn',
  OtherPlayerRespawn: 'otherPlayerRespawn',
  /* eslint-enable */
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketEmitOnlyActionType = typeof SocketEmitOnlyActionType[keyof typeof SocketEmitOnlyActionType]

/**
 * 送信者を除いた全員に送るAction
 */
/* eslint-disable */
export const SocketNormalActionType = {
  Turn: 'turn',
  Walk: 'walk',
  Stop: 'stop',
  Profile: 'profile',
  Shark: 'shark',
  Bomb: 'bomb',
  Megaphone: 'megaphone',
  InvincibleWorldMode: 'invincibleWorldMode',
  /* eslint-enable */
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketNormalActionType = typeof SocketNormalActionType[keyof typeof SocketNormalActionType]

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SocketNormalActionNames = Object.values(SocketNormalActionType) as SocketNormalActionType[]

/**
 * 送信者自身にも送り返すAction
 */
/* eslint-disable */
export const SocketChattableActionType = {
  Chat: 'chat',
} as const
/* eslint-enable */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketChattableActionType = typeof SocketChattableActionType[keyof typeof SocketChattableActionType]

// 要素がchatの1つのためtype assertionが不要だが, 書き方の統一のためにsuppress
/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const SocketChattableActionNames = Object.values(SocketChattableActionType) as SocketChattableActionType[]

export const SocketEmitActionType = {
  ...SocketEmitOnlyActionType,
  ...SocketNormalActionType,
  ...SocketChattableActionType,
}
/* eslint-enable */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketEmitActionType = typeof SocketEmitActionType[keyof typeof SocketEmitActionType]
// eslint-disable-next-line @typescript-eslint/naming-convention
export const SocketListenActionType = {
  ...SocketNormalActionType,
  ...SocketChattableActionType,
}
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SocketListenActionType = typeof SocketListenActionType[keyof typeof SocketListenActionType]

/**
 * Serverから送るactionEventのパケットの型
 */
export type EmitData = Array<ActionFromServer<SocketEmitActionType>>

/**
 * Clientから送られたactionEventのパケットの型
 */
export interface ReceiveData {
  id: string
  actions: Array<ActionFromClient<SocketListenActionType>>
}

/**
 * Clientから送られてくるActionの型
 */
export interface ActionFromClient<Type extends SocketListenActionType> {
  type: Type
  infos: Array<Parameters<ActionEmitTypeTable[Type]>[0]>
}

/**
 * Serverが送信するときのActionの型
 */
export interface ActionFromServer<Type extends SocketEmitActionType> {
  type: Type
  info: Parameters<ActionEmitTypeTable[Type]>[0]
}

/**
 * 送信されたアクションに必ず含まれるプロパティ
 */
export interface SocketReceiveBaseInfo {
  _emitTime: number
}

/**
 * Listenに登録するcallbackの引数のdataに必ず含まれるプロパティ
 */
export interface ReceiveBaseInfo {
  id: string
  /** emitAction時の現在時間 */
  _emitTime: number
}

/**
 * 送信時に必ず含まれるプロパティ
 */
export interface EmitBaseInfo {
  id: string
  /** emitAction時の現在時間 */
  _emitTime: number
}

/**
 * profile変更時に送信するための型
 * TODO: heroの接頭辞を削る
 */
export interface ProfileInfo {
  heroColor: string
  heroName: string
  direction: Direction
}

/**
 * playerが歩いてるときの状態を送信するための型
 * TODO: walkSpeedが可変みたいなので,対応できるように見直しをする
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
  cause: DamageCause
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
  respawnPos: Vector
  direction: Direction
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
  position: Vector
}

/**
 * チャット送信するための型
 * 名前は考え直したい
 */
export interface ChatInfo {
  message: string
}

/**
 * ボイスチャットのメガホン機能のON/OFF時に送信するための型
 */
export interface MegaphoneInfo {
  active: boolean
}

/**
 * 全プレイヤー無敵モードのON/OFF時に送信するための型
 */
export interface InvincibleWorldModeInfo {
  active: boolean
}
