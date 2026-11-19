import type { AlchemyItemKind } from './alchemyItemKind'

/**
 * 錬金アイテムをアイテムボックスに表示するためのインターフェース
 * @param kind 錬金アイテムの種類
 * @param image アイテムの画像パス
 */
export interface IAlchemyItem {
  kind: AlchemyItemKind
  image: string
}
