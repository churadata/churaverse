import type { Direction, Position } from 'churaverse-engine-client'

/**
 * BossRenderの抽象
 * 主語はBoss
 */
export interface IBossRenderer {
  spawn: (source: Position) => void
  destroy: () => void

  /**
   * ダメージを受ける処理
   * @param amount ダメージ量
   * @param hp ボスのHP
   */
  damage: (amount: number, hp: number) => void

  /* ボスの移動
   * @param onUpdate 移動元
   */
  walk: (
    startPos: Position,
    dest: Position,
    direction: Direction,
    speed: number,
    onUpdate: (pos: Position) => void,
    onComplete: () => void
  ) => void
}
