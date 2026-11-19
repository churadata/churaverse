import type { ItemKind } from '../domain/itemKind'

/**
 * 錬金アイテムを生成するための素材アイテムの組み合わせ
 * |||
 * | --- | --- |
 * | all_same | 同じ素材アイテム3つ |
 * | two_same_one_diff | 同じ素材アイテム2つと異なる素材アイテム1つ |
 * | all_diff | 異なる素材アイテム3つ |
 */
export type AlchemyItemGenerateType = 'all_same' | 'two_same_one_diff' | 'all_diff'

/**
 * 錬金アイテムのレシピ
 * @param pattern 錬金アイテムを生成するための素材アイテムの組み合わせ
 * @param materialKind 錬金アイテムを生成するための素材アイテムの種類 (`pattern`が`all_diff`の場合はこの種類は影響しない)
 */
export interface AlchemyItemRecipe {
  readonly pattern: AlchemyItemGenerateType
  readonly materialKind: ItemKind
}
