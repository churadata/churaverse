import { logger } from 'churaverse-engine-server'
import type { TiledLayerTilelayer, TiledMapOrthogonal, TiledTileset } from 'tiled-types'
import { WorldMap } from './domain/worldMap'
import { NotExistsMapConfigInfoError } from './error/notExistsMapConfigInfoError'
import { NotExistsPropertyLayerError } from './error/notExistsPropertyLayerError'
import type { MapInfo } from './interface/IMapConfig'
import type { IMapManager } from './interface/IMapManager'
import { mapConfig } from './mapConfig'

export type LayerName = 'collision' | 'spawn' | 'Base'

export class MapManager implements IMapManager {
  private readonly mapConfigInfos = new Map<string, MapInfo>()
  private _currentMap: WorldMap
  private readonly propertiesMap = new Map<LayerName, boolean[][]>()

  public constructor(mapJSON: TiledMapOrthogonal, mapId: string) {
    this._currentMap = this.loadMap(mapJSON, mapId)
    Object.entries(mapConfig.maps).forEach(([mapId, mapInfo]) => {
      this.mapConfigInfos.set(mapId, mapInfo)
    })
  }

  /**
   * マップのJSONデータを読み込んで返す
   */
  public static async loadMapJSON(fileName: string): Promise<TiledMapOrthogonal> {
    // 動的importの代わりに、ファイル名に基づいた静的importを使用
    // webpackでバンドルできないため…
    switch (fileName) {
      case 'Map.json':
        return require('./data/Map.json')
      case 'Map2.json':
        return require('./data/Map2.json')
      default:
        throw new Error(`Map file ${fileName} not found`)
    }
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

  private loadMap(mapJSON: TiledMapOrthogonal, mapId: string, drawingMapName: string = 'Base'): WorldMap {
    const gridSize = 40 // １マスの大きさ
    const heightTileNum = mapJSON.height
    const widthTileNum = mapJSON.width
    const height = heightTileNum * gridSize
    const width = widthTileNum * gridSize

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
      logger.debug(layer.name)
      const layerNameIndex = mapJSON.layers.indexOf(layer)
      this.propertiesMap.set(
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
      height,
      width,
      heightTileNum,
      widthTileNum,
      gridSize,
      this.propertiesMap
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
      throw new NotExistsPropertyLayerError(propertyName)
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
