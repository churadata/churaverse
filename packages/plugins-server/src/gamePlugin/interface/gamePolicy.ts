/**
 * ゲームポリシーのインターフェース
 * - ミニゲームの途中参加可否などを定義する
 */
export interface GamePolicy {
  /** ミニゲームの途中参加可否 */
  allowMidwayJoin: boolean
}
