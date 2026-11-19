import fireOreImage from '../assets/fireOre.png'
import grassOreImage from '../assets/grassOre.png'
import herbImage from '../assets/herb.png'
import waterOreImage from '../assets/waterOre.png'

export const ITEM_KINDS = ['fireOre', 'waterOre', 'grassOre', 'herb'] as const

/**
 * アイテムの種類
 */
export type ItemKind = (typeof ITEM_KINDS)[number]

export const materialItemImage: Record<ItemKind, string> = {
  fireOre: fireOreImage,
  waterOre: waterOreImage,
  grassOre: grassOreImage,
  herb: herbImage,
}
