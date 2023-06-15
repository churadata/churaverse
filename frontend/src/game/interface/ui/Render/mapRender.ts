import { Scene, Tilemaps } from 'phaser'
import { GRID_SIZE } from '../../../domain/worldConfig'
import { IMapRender } from '../../../domain/IRender/IMapRender'
import { Position } from '../../../domain/model/core/position'

// mapのテクスチャ名
const MAP_TEXTURE_NAME = 'mapTiles'

// mapのtile画像のパス
const MAP_TILE_IMAGE_PATH = 'assets/map_tile.png'

// mapの設定jsonデータの識別名
const MAP_JSON_NAME = 'mapJson'

// mapの設定jsonのパス
const MAP_TILE_JSON_PATH = 'assets/maps/Map.json'

// jsonの中のtilesets > name
const TILE_SET_NAME_IN_JSON = 'map_tile'

// map のレイヤーID
const MAP_LAYER_ID = 'Base'

/**
 * Map作成クラス
 */
export class MapRender implements IMapRender {
  // 地面オブジェクト
  public groundLayer: Tilemaps.TilemapLayer
  private readonly mapData: Tilemaps.Tilemap

  private constructor(private readonly scene: Scene) {
    this.mapData = this.scene.add.tilemap(MAP_JSON_NAME)
    const tiles = this.mapData.addTilesetImage(TILE_SET_NAME_IN_JSON, MAP_TEXTURE_NAME)

    // レイヤー作成
    this.groundLayer = this.mapData.createLayer(MAP_LAYER_ID, tiles, -GRID_SIZE / 2, -GRID_SIZE / 2) // (0, 0)がタイルの中心になるようにx, yを半グリッド分ずらす

    /**
     * カメラがワールドの外側を映すことのないように
     */
    this.scene.cameras.main.setBounds(
      -GRID_SIZE / 2,
      -GRID_SIZE / 2,
      this.mapData.widthInPixels,
      this.mapData.heightInPixels
    )
  }

  public static async build(scene: Scene): Promise<MapRender> {
    return await new Promise<void>((resolve, reject) => {
      if (scene.textures.exists(MAP_TEXTURE_NAME)) {
        resolve()
      }

      scene.load.image(MAP_TEXTURE_NAME, MAP_TILE_IMAGE_PATH)
      scene.load.tilemapTiledJSON(MAP_JSON_NAME, MAP_TILE_JSON_PATH)
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.once('loaderror', (fileObj: any) => {
        reject(fileObj)
      })
      scene.load.start()
    }).then(() => {
      return new MapRender(scene)
    })
  }

  public hasBlockingTile(pos: Position): boolean {
    // nonNull = false なのでgetTileAtの戻り値はTilemaps.Tile | null
    const tile = this.mapData.getTileAt(pos.gridX, pos.gridY, false) as Tilemaps.Tile | null

    // タイルが存在しない場合は通行不可とみなす
    if (tile === null) return true

    return tile.properties.collision
  }
}
