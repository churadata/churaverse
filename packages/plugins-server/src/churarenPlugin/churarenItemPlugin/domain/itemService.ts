import { uniqueId } from '@churaverse/churaren-core-plugin-server'
import type { WorldMap } from '@churaverse/map-plugin-server'
import type { SendableObject } from '@churaverse/network-plugin-server'
import type { Vector } from 'churaverse-engine-server'
import { ITEM_KINDS, type ItemKind } from '../domain/itemKind'
import type { ChurarenItemInfo, ChurarenItemInfoMap } from '../message/churarenItemSpawnMessage'
import type { IItemRepository } from './IItemRepository'
import { Item } from './item'

/**
 * 時間経過済みのアイテムを削除する
 */
export function removeItems(items: IItemRepository): string[] {
  const deleteItems: string[] = []
  items.getAllId().forEach((itemId) => {
    const item = items.get(itemId)
    if (item?.isDespawn ?? false) {
      items.delete(itemId)
      deleteItems.push(itemId)
    }
  })
  return deleteItems
}

/**
 * アイテムの生成を行う
 */
export function generatedItemMap(items: IItemRepository, itemNum: number, worldMap: WorldMap): ChurarenItemInfoMap {
  const itemsMap: ChurarenItemInfoMap = {}
  for (let i = 0; i < itemNum; i++) {
    const item = new Item(uniqueId(), worldMap.getRandomPoint(), Date.now(), getRandomItemKind())
    if (items.get(item.id) !== undefined) continue
    itemsMap[item.id] = itemInfoToSendableObject(item)
    items.set(item.id, item)
  }
  return itemsMap
}

function itemInfoToSendableObject(item: Item): ChurarenItemInfo {
  const info: ChurarenItemInfo = {
    id: item.id,
    kind: item.kind,
    startPos: item.position.toVector() as Vector & SendableObject,
    spawnTime: item.spawnTime,
  }
  return info
}

function getRandomItemKind(): ItemKind {
  return ITEM_KINDS[Math.floor(Math.random() * ITEM_KINDS.length)]
}
