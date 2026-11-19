import { GRID_SIZE } from 'churaverse-engine-client'
import type { Scene, Tilemaps } from 'phaser'
import type { DrawingMapData } from '../mapJsonLoader'

/**
 * tilesetのテクスチャ名
 */
const TILESET_TEXTURE_NAME: (tilesetName: string) => string = (tilesetName) => `${tilesetName}`

/**
 * tileset画像のパス
 */
const TILESET_IMG_PATH: (tilesetName: string) => string = (tilesetName) => `assets/maps/${tilesetName}.png`

/**
 * Map作成クラス
 */
export class MapRenderer {
  private readonly tilemap: Tilemaps.Tilemap
  private readonly layers = new Map<string, Tilemaps.TilemapLayer>()

  private constructor(
    private readonly scene: Scene,
    mapData: DrawingMapData
  ) {
    this.tilemap = this.scene.add.tilemap(mapData.mapId)

    const tiles = mapData.tilesetNames
      .map((tilesetName) => {
        return this.tilemap.addTilesetImage(tilesetName, tilesetName)
      })
      .filter((item): item is NonNullable<typeof item> => item != null)

    mapData.layerNames.forEach((layerName) => {
      const layer = this.tilemap.createLayer(layerName, tiles, -GRID_SIZE / 2, -GRID_SIZE / 2) // (0, 0)がタイルの中心になるようにx, yを半グリッド分ずらす
      // gpu引数を渡していないため実体は常にTilemapLayer(Phaser 4で戻り値にTilemapGPULayerが加わった)
      if (layer instanceof Phaser.Tilemaps.TilemapLayer) this.layers.set(layerName, layer)
    })

    /**
     * カメラがワールドの外側を映すことのないように
     */
    this.scene.cameras.main.setBounds(
      -GRID_SIZE / 2,
      -GRID_SIZE / 2,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    )
  }

  public static async build(scene: Scene, mapData: DrawingMapData): Promise<MapRenderer> {
    return await new Promise<void>((resolve, reject) => {
      if (
        mapData.tilesetNames.every((tilesetName) => {
          return scene.textures.exists(TILESET_TEXTURE_NAME(tilesetName))
        }) &&
        scene.cache.json.exists(mapData.mapId)
      ) {
        resolve()
      }

      mapData.tilesetNames.forEach((tilesetName) => {
        scene.load.image(TILESET_TEXTURE_NAME(tilesetName), TILESET_IMG_PATH(tilesetName))
      })
      scene.load.tilemapTiledJSON(mapData.mapId, mapData.path)
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.once('loaderror', (fileObj: any) => {
        reject(fileObj)
      })
      scene.load.start()
    }).then(() => {
      return new MapRenderer(scene, mapData)
    })
  }
}
