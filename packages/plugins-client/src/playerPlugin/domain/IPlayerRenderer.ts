import type { IFocusableRenderer } from '@churaverse/core-ui-plugin-client'
import type { Direction, Position } from 'churaverse-engine-client'
import type { GameObjects } from 'phaser'
import type { PlayerColor } from '../types/playerColor'

/**
 * プレイヤー描画のためのインタフェース
 */
export interface IPlayerRenderer extends IFocusableRenderer {
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
  heal: (healAmount: number, hp: number) => void
  applyPlayerColor: (color: PlayerColor) => void
  applyPlayerName: (name: string) => void
  highlightNameplate: () => void
  destroy: () => void
  setParentContainer: (container: GameObjects.Container) => void
  addToPlayerContainer: (child: Phaser.GameObjects.GameObject) => void
  addToPlayerFrontContainer: (child: Phaser.GameObjects.GameObject) => void
  addToNameplateContainer: (child: Phaser.GameObjects.Text | Phaser.GameObjects.Image) => void
  realignNameplate: () => void
  setSpriteAlpha: (alpha: number) => void
  blinkTarget: (totalDurationMs: number, blinkCycleMs?: number) => void
}
