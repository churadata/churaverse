import type { IRectangle } from './IRectangle'

export interface ICollidableEntity {
  id: string
  isCollidable: boolean // falseの時衝突は無視される
  getRect: () => IRectangle // 当たり判定に使用する矩形情報（幅・高さ・位置）を返す
}
