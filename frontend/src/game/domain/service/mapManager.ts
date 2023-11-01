import { mapConfig } from '../model/mapConfig'
import { WorldMap } from '../model/worldMap'

export class MapManager {
  private readonly _maps = new Map<string, WorldMap>()

  public constructor() {
    mapConfig.maps.forEach((item) => {
      this._maps.set(item.mapName, new WorldMap(item.mapName, item.jsonName))
    })
  }

  public get maps(): Map<string, WorldMap> {
    return this._maps
  }
}
