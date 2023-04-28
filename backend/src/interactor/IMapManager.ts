import { WorldMap } from '../domain/model/worldMap'

export interface IMapManager {
  reloadMap: (mapName: string) => Promise<void>
  currentMap: WorldMap
}
