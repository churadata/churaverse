import type { WorldMap } from '../domain/worldMap'

export interface IMapManager {
  /**
   * 現在のマップ
   */
  currentMap: WorldMap

  /**
   * 全マップのマップ名
   */
  mapDisplayNames: string[]
}
