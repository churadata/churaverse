import { IFocusableRender } from './IFocusableRender'
import { Direction } from '../model/core/direction'
import { PlayerColorName } from '../model/types'
import { Position } from '../model/core/position'
import { GameObjects } from 'phaser'

/**
 * プレイヤー描画のためのインタフェース
 */
export interface IPlayerRender extends IFocusableRender {
  setSpriteId: (id: string) => void
  appear: () => void
  disappear: () => void
  respawn: (position: Position, direction: Direction, hp: number) => void
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
  damage: (amount: number, hp: number) => void
  applyPlayerColor: (color: PlayerColorName) => void
  applyPlayerName: (name: string) => void
  destroy: () => void
  addToContainer: (container: GameObjects.Container) => void
}
