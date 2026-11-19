import type { AlchemyItemKind } from '@churaverse/churaren-alchemy-base-plugin-server'
import { type AlchemyItemRecipeRecord, AlchemyItemRegistry } from './alchemyItemRegistry'
import type { ItemKind } from './domain/itemKind'
import type { IAlchemyItemManager } from './interface/IAlchemyItemManager'
import type { AlchemyItemRecipe } from './interface/IAlchemyItemRecipe'
import type { IAlchemyItemRegister } from './interface/IAlchemyItemRegister'

export class AlchemyItemManager implements IAlchemyItemRegister, IAlchemyItemManager {
  private readonly alchemyItemRegistry: AlchemyItemRegistry
  private readonly pendingRecipes: Map<ItemKind, Partial<AlchemyItemRecipeRecord>>

  public constructor() {
    this.alchemyItemRegistry = new AlchemyItemRegistry()
    this.pendingRecipes = new Map()
  }

  public reset(): void {
    this.alchemyItemRegistry.reset()
    this.pendingRecipes.clear()
  }

  public register(recipe: AlchemyItemRecipe, kind: AlchemyItemKind): void {
    const pendingRecipe = this.pendingRecipes.get(recipe.materialKind) ?? {}

    if (recipe.pattern === 'all_same') {
      if (pendingRecipe.allSame != null) {
        throw new Error(`[AlchemyItemManager] 'all_same' for ${recipe.materialKind} is already registered.`)
      }
      pendingRecipe.allSame = kind
    } else if (recipe.pattern === 'two_same_one_diff') {
      if (pendingRecipe.twoSameOneDiff != null) {
        throw new Error(`[AlchemyItemManager] 'two_same_one_diff' for ${recipe.materialKind} is already registered.`)
      }
      pendingRecipe.twoSameOneDiff = kind
    } else {
      // all_diff はレシピ登録対象外（3種バラバラは常にblackHoleを返すため）
      return
    }

    this.pendingRecipes.set(recipe.materialKind, pendingRecipe)

    this.tryFinalizeRecipe(recipe.materialKind)
  }

  /**
   * 未完成レシピが完成していれば、Registryに登録する
   */
  private tryFinalizeRecipe(materialKind: ItemKind): void {
    const pendingRecipe = this.pendingRecipes.get(materialKind)

    if (pendingRecipe?.allSame != null && pendingRecipe?.twoSameOneDiff != null) {
      const recipeRecord: AlchemyItemRecipeRecord = {
        allSame: pendingRecipe.allSame,
        twoSameOneDiff: pendingRecipe.twoSameOneDiff,
      }

      this.alchemyItemRegistry.register(materialKind, recipeRecord)
      this.pendingRecipes.delete(materialKind)
    }
  }

  private get(alchemyItemRecipe: AlchemyItemRecipe): AlchemyItemKind {
    const alchemyItem = this.alchemyItemRegistry.get(alchemyItemRecipe)
    return alchemyItem ?? 'blackHole'
  }

  public getByMaterialItems(materialItems: ItemKind[]): AlchemyItemKind {
    const countKinds = this.countAlchemyItemKinds(materialItems)
    const itemCount = countKinds.size

    if (itemCount === 1) {
      return this.get({ pattern: 'all_same', materialKind: materialItems[0] })
    } else if (itemCount === 2) {
      const sortedKinds = [...countKinds.entries()].sort((a, b) => b[1] - a[1])
      return this.get({ pattern: 'two_same_one_diff', materialKind: sortedKinds[0][0] as ItemKind })
    } else if (itemCount === 3) {
      return 'blackHole'
    }

    return 'blackHole'
  }

  private countAlchemyItemKinds(items: ItemKind[]): Map<ItemKind, number> {
    const kindCount = new Map<ItemKind, number>()

    items.forEach((item) => {
      kindCount.set(item, (kindCount.get(item) ?? 0) + 1)
    })

    return kindCount
  }
}
