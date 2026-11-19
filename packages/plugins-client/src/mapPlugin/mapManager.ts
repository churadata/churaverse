import type { TiledLayerTilelayer, TiledMapOrthogonal, TiledTileset } from 'tiled-types'
import { type LayerName, WorldMap } from './domain/worldMap'
import { NotExistsMapConfigInfoError } from './error/notExistsMapConfigInfoError'
import type { MapInfo } from './interface/IMapConfig'
import type { IMapManager } from './interface/IMapManager'
import { mapConfig } from './mapConfig'

const DEFAULT_DRAWING_LAYERS: string[] = ['Base', 'Collision']
type PickedMapInfo = Pick<MapInfo, 'jsonName' | 'displayName' | 'drawingLayerNames' | 'tilesets'>

export class MapManager implements IMapManager {
  private readonly mapConfigInfos = new Map<string, Required<PickedMapInfo>>()
  private _currentMap: WorldMap

  public constructor() {
    // priorMapDataMessage受信後に実際のcurrentMap代入
    this._currentMap = new WorldMap('dummy', 'dummy', 1, 1, 1, 1, 1, new Map())
    Object.entries(mapConfig.maps).forEach(([mapId, _mapInfo]) => {
      const mapInfo: Required<PickedMapInfo> = {
        ..._mapInfo,
        drawingLayerNames: _mapInfo.drawingLayerNames ?? DEFAULT_DRAWING_LAYERS,
      }
      this.mapConfigInfos.set(mapId, mapInfo)
    })
  }

  public get mapDisplayNames(): string[] {
    return Array.from(this.mapConfigInfos.values()).map((info) => {
      return info.displayName
    })
  }

  public get mapIds(): string[] {
    return Array.from(this.mapConfigInfos.keys())
  }

  /**
   * マップのJSONデータを読み込んで返す
   */
  private static async loadMapJSON(fileName: string): Promise<TiledMapOrthogonal> {
    const file = await fetch(`assets/maps/data/${fileName}`)
    const json = await file.json()
    return json as TiledMapOrthogonal
  }

  /**
   * マップのJsonデータを元にcurrentMapを更新
   */
  public async reloadMap(mapId: string): Promise<void> {
    const fileName = this.mapConfigInfos.get(mapId)?.jsonName
    if (fileName === undefined) throw new NotExistsMapConfigInfoError(mapId)

    const mapJSON = await MapManager.loadMapJSON(fileName)
    this._currentMap = this.loadMap(mapJSON, mapId)
  }

  public getMapConfigInfo(mapId: string): Required<PickedMapInfo> {
    const mapConfigInfo = this.mapConfigInfos.get(mapId)
    if (mapConfigInfo === undefined) throw new NotExistsMapConfigInfoError(mapId)

    return mapConfigInfo
  }

  private loadMap(mapJSON: TiledMapOrthogonal, mapId: string, drawingMapName: string = 'Base'): WorldMap {
    const heightTileNum = mapJSON.height
    const widthTileNum = mapJSON.width
    const gridSize = mapJSON.tileheight

    const layerProperty = new Map<string, boolean[][]>()
    const propertiesLayers = mapJSON.layers.filter((layer) => layer.name !== drawingMapName) as TiledLayerTilelayer[]

    const propertyLayersMap = new Map<LayerName, number[]>()

    propertiesLayers.forEach((layer) => {
      propertyLayersMap.set(layer.name as LayerName, layer.data as number[])
    })

    const mapArray2d = new Map<string, number[][]>()

    propertyLayersMap.forEach((layerData, layerName) => {
      mapArray2d.set(layerName, this.reshape(layerData, heightTileNum, widthTileNum))
    })

    propertiesLayers.forEach((layer) => {
      const layerNameIndex = mapJSON.layers.indexOf(layer)
      layerProperty.set(
        layer.name as LayerName,
        this.createPropertyMap(
          mapJSON.tilesets,
          mapArray2d.get(layer.name),
          mapJSON.tilesets[layerNameIndex].name,
          layer.name.toLocaleLowerCase()
        )
      )
    })

    return new WorldMap(
      mapId,
      this.mapConfigInfos.get(mapId)?.displayName ?? mapId,
      gridSize * heightTileNum,
      gridSize * widthTileNum,
      heightTileNum,
      widthTileNum,
      gridSize,
      layerProperty
    )
  }

  private reshape(array1d: number[], rows: number, cols: number): number[][] {
    const array2d: number[][] = []

    for (let r = 0; r < rows; r++) {
      const row = []
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        if (i < array1d.length) {
          row.push(array1d[i])
        }
      }
      array2d.push(row)
    }

    return array2d
  }

  public get currentMap(): WorldMap {
    return this._currentMap
  }

  private createPropertyMap(
    tilesets: TiledTileset[],
    mapArray2d: number[][] | undefined,
    propertyName: string,
    tilesetName: string
  ): boolean[][] {
    if (mapArray2d === undefined) {
      throw new Error(`${propertyName}もったlayerが存在しません`)
    }

    const propertyIds: number[] = []
    const tileset = tilesets.find((tileset) => tileset.name === propertyName)
    const firstgid = tileset != null ? tileset.firstgid : 0

    for (const tile of tileset?.tiles ?? []) {
      for (const property of tile.properties ?? []) {
        if (property.name === tilesetName && typeof property.value === 'boolean' && property.value) {
          propertyIds.push(tile.id + firstgid)
          break
        }
      }
    }

    const propertyMap: boolean[][] = []
    for (let i = 0; i < mapArray2d.length; i++) {
      const row = []
      for (let j = 0; j < mapArray2d[i].length; j++) {
        row.push(propertyIds.includes(mapArray2d[i][j]))
      }
      propertyMap.push(row)
    }

    return propertyMap
  }
}
