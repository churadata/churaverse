import { Direction } from '../direction'
import { PlayerColorName } from '../model/types'
import { Position } from '../position'

/**
 * プレイヤー描画のためのインタフェース
 */
export interface IPlayerRender {
  setSpriteId: (id: string) => void
  appear: () => void
  disappear: () => void
  respawn: (position: Position) => void
  leave: () => void
  focus: () => void
  /**
   * walk Phaserのtweenによりアニメーションするため,座標の同期をonUpdateでさせる
   * @param onUpdate updateごとに座標の通知
   */
  walk: (
    dest: Position,
    direction: Direction,
    speed: number,
    onUpdate: (pos: Position) => void,
    onComplete: () => void
  ) => void
  turn: (direction: Direction) => void
  stop: () => void
  teleport: (position: Position) => void
  dead: () => void
  damage: (amount: number) => void
  applyPlayerColor: (color: PlayerColorName) => void
  applyPlayerName: (name: string) => void
  destroy: () => void
}
