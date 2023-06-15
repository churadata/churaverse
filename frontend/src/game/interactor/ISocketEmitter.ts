import { Direction } from '../domain/model/core/direction'
import { IPlayerRender } from '../domain/IRender/IPlayerRender'
import { Player } from '../domain/model/player'
import { PlayerColorName } from '../domain/model/types'
import { Position } from '../domain/model/core/position'

type Id = string
export interface ProcessedPreloadedData {
  existPlayers: Array<[Id, Player, IPlayerRender]>
  megaphoneUsers: Id[]
}

/**
 * interactorからemitするためのinterface
 * returnが期待される場合は必ずPromiseを使うこと
 */
export interface ISocketEmitter {
  /**
   * ゲーム参加
   */
  join: (player: Player, id: string) => void

  /**
   * 既存プレイヤーの情報を要求する
   * @returns 既存プレイヤーの一覧 stringはid
   */
  requestPreloadedData: () => Promise<ProcessedPreloadedData>

  /**
   * keepaliveのようなもの
   * 返却値は使わない
   * @returns プレイヤーの一覧
   */
  checkConnect: () => Promise<Array<[string, Player]>>

  /**
   * playerが歩く
   * @param position 初期位置
   * @param direction 次の向き
   * @param speed 移動速度
   */
  walkPlayer: (position: Position, direction: Direction, speed: number) => void

  /**
   * playerの歩行が停止する
   * @param position 停止位置
   */
  stopPlayer: (position: Position, direction: Direction) => void

  /**
   * playerが向きを変える
   * @param direction 向き
   */
  turnPlayer: (direction: Direction) => void

  /**
   * playerが名前を変える
   * @param playerName 名前
   * @param color 色
   */
  updatePlayerProfile: (playerName: string, color: PlayerColorName) => void

  /**
   * sharkが発生したとき
   * @param sharkId sharkのid
   * @param position 初期位置
   */
  spawnShark: (sharkId: string, position: Position, direction: Direction) => void

  /**
   * bombが発生したとき
   * @param bombId bombのid
   * @param position 初期位置
   */
  spawnBomb: (bombId: string, position: Position) => void

  /**
   * chatの送信
   * @param message 内容
   */
  chat: (name: string, message: string) => void

  /**
   * メガホン機能ON/OFFの切り替え
   */
  toggleMegaphone: (activate: boolean) => void

  /**
   * バッファの中身を送信する
   */
  flushActions: () => void
}
