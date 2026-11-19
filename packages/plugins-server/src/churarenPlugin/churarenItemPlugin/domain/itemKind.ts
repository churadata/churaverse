export const ITEM_KINDS = ['fireOre', 'waterOre', 'grassOre', 'herb'] as const

export type ItemKind = (typeof ITEM_KINDS)[number]
