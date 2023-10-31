import { WorldMap } from '../../domain/model/worldMap'
import { IMapManager } from '../../interactor/IMapManager'
import { TiledLayerTilelayer, TiledMapOrthogonal, TiledTileset } from 'tiled-types'

export type LayerName = 'collision' | 'spawn' | 'Base'

export class MapManager implements IMapManager {
  private _currentMap: WorldMap
  private readonly propertiesMap = new Map<LayerName, boolean[][]>()

  public static async build(mapName: string): Promise<MapManager> {
    const mapJSON = await MapManager.getMapJSON(mapName)
    return new MapManager(mapJSON, mapName)
  }

  public constructor(mapJSON: TiledMapOrthogonal, mapName: string) {
    this._currentMap = this.loadMap(mapJSON, mapName)
  }

  /**
   * マップのJSONデータを読み込んで返す
   */
  public static async getMapJSON(mapName: string): Promise<TiledMapOrthogonal> {
    return (await import('./data/' + mapName)) as TiledMapOrthogonal
  }

  /**
   * マップのJsonデータを元にcurrentMapを更新
   */
  public async reloadMap(mapName: string): Promise<void> {
    const mapJSON = await MapManager.getMapJSON(mapName)
    this._currentMap = this.loadMap(mapJSON, mapName)
  }

  private loadMap(mapJSON: TiledMapOrthogonal, mapName: string, drawingMapName: string = 'Base'): WorldMap {
    const gridSize = 40 // １マスの大きさ
    const heightTileNum = mapJSON.height
    const widthTileNum = mapJSON.width
    const height = gridSize * heightTileNum
    const width = gridSize * widthTileNum

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
      console.log(layer.name)
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

    return new WorldMap(mapName, height, width, heightTileNum, widthTileNum, gridSize, this.propertiesMap)
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

  public get mapName(): string {
    return this._currentMap.mapName
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
