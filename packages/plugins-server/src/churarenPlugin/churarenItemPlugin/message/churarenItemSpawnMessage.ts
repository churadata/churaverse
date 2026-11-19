import type { Sendable, SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene, Vector } from 'churaverse-engine-server'
import type { ItemKind } from '../domain/itemKind'

export interface ChurarenItemInfo extends SendableObject {
  id: string
  kind: ItemKind
  startPos: Vector & Sendable
  spawnTime: number
}

export type ChurarenItemInfoMap = Record<string, ChurarenItemInfo>

export interface ChurarenItemSpawnData extends SendableObject {
  items: ChurarenItemInfoMap
}

export class ChurarenItemSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenItemSpawnData) {
    super('churarenItemSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    churarenItemSpawn: ChurarenItemSpawnMessage
  }
}
