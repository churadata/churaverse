import { WorldMap } from '../../domain/model/worldMap'
import { IMapManager } from '../../interactor/IMapManager'
import { TiledLayerTilelayer, TiledMapOrthogonal } from 'tiled-types'

export class MapManager implements IMapManager {
  private _currentMap: WorldMap

  public static async build(mapName: string): Promise<MapManager> {
    const mapJSON = await MapManager.getMapJSON(mapName)
    return new MapManager(mapJSON)
  }

  public constructor(mapJSON: TiledMapOrthogonal) {
    this._currentMap = this.loadMap(mapJSON)
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
    this._currentMap = this.loadMap(mapJSON)
  }

  private loadMap(mapJSON: TiledMapOrthogonal): WorldMap {
    const layer = mapJSON.layers[0] as TiledLayerTilelayer
    const mapArray = layer.data as number[]
    const gridSize = 40 // １マスの大きさ
    const heightTileNum = mapJSON.height
    const widthTileNum = mapJSON.width
    const height = gridSize * heightTileNum
    const width = gridSize * widthTileNum

    // collisionMapを作成
    const mapArray2d = this.reshape(mapArray, heightTileNum, widthTileNum)
    const collisionIds: number[] = []
    const firstgid = mapJSON.tilesets[0].firstgid
    for (const tile of mapJSON.tilesets[0].tiles ?? []) {
      for (const property of tile.properties ?? []) {
        // propertiesにcollisionを持つtileのidを抽出
        if (
          property.name === 'collision' &&
          typeof property.value === 'boolean' &&
          property.value
        ) {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          collisionIds.push(tile.id + firstgid)
          break
        }
      }
    }
    // 侵入不可=true
    // MapのJsonでpropertiesにcollisionを持つtileを侵入不可マスとしている
    const collision: boolean[][] = []
    for (let i = 0; i < heightTileNum; i++) {
      const row = []
      for (let j = 0; j < widthTileNum; j++) {
        if (collisionIds.includes(mapArray2d[i][j])) {
          row.push(true)
        } else {
          row.push(false)
        }
      }
      collision.push(row)
    }

    return new WorldMap(
      height,
      width,
      heightTileNum,
      widthTileNum,
      gridSize,
      collision
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
}
