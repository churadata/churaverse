import { Scene, Tilemaps } from 'phaser'
import { GRID_SIZE } from '../../../domain/model/worldConfig'
import { IMapRender } from '../../../domain/IRender/IMapRender'
import { Position } from '../../../domain/model/core/position'

// mapのテクスチャ名
const MAP_TEXTURE_NAME = 'mapTiles'

// mapのtile画像のパス
const MAP_TILE_IMAGE_PATH = 'assets/maps/map_tile.png'

const COLLISION_LAYER_NAME = 'Collision'

// マップの描画に必要なデータ
interface MapJsonData {
  path: string
  tilesets: string
  layerId: string
}

/**
 * Map作成クラス
 */
export class MapRender implements IMapRender {
  // 地面オブジェクト
  public groundLayer: Tilemaps.TilemapLayer
  private readonly mapData: Tilemaps.Tilemap

  private constructor(private readonly scene: Scene, mapName: string, tilesets: string, layerId: string) {
    this.mapData = this.scene.add.tilemap(mapName)
    const tiles = this.mapData.addTilesetImage(tilesets, MAP_TEXTURE_NAME)

    // レイヤー作成
    this.groundLayer = this.mapData.createLayer(layerId, tiles, -GRID_SIZE / 2, -GRID_SIZE / 2) // (0, 0)がタイルの中心になるようにx, yを半グリッド分ずらす

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

  public static async build(scene: Scene, mapName: string, mapData: MapJsonData): Promise<MapRender> {
    return await new Promise<void>((resolve, reject) => {
      if (scene.textures.exists(MAP_TEXTURE_NAME) && scene.cache.json.exists(mapName)) {
        resolve()
      }
      scene.load.image(MAP_TEXTURE_NAME, MAP_TILE_IMAGE_PATH)
      scene.load.tilemapTiledJSON(mapName, mapData.path)
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.once('loaderror', (fileObj: any) => {
        reject(fileObj)
      })
      scene.load.start()
    }).then(() => {
      return new MapRender(scene, mapName, mapData.tilesets, mapData.layerId)
    })
  }

  public hasBlockingTile(pos: Position): boolean {
    // マップの描画内かどうかを返す
    // nonNull = false なのでgetTileAtの戻り値はTilemaps.Tile | null
    const inWorld = this.mapData.getTileAt(pos.gridX, pos.gridY, false) as Tilemaps.Tile | null
    if (inWorld === null) return true

    // Collisionレイヤー内にtileがあればtrueを返す
    const blockingTile = this.mapData.hasTileAt(pos.gridX, pos.gridY, COLLISION_LAYER_NAME)

    return blockingTile
  }
}
