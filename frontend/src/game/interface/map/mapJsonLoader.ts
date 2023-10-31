import { TiledMapOrthogonal } from 'tiled-types'

// マップの描画に必要なデータ
interface MapJsonData {
  path: string
  tilesets: string
  layerId: string
}

export class MapJsonLoader {
  public constructor(private readonly mapName: string) {}
  /**
   * マップのJSONデータを読み込んで返す
   */
  public static async getMapJSON(mapName: string): Promise<MapJsonData> {
    const pathToMapJSON = '/public/assets/maps/data/' + mapName
    const mapJSON = (await import(pathToMapJSON)) as TiledMapOrthogonal
    let layerIdIndex: number = -1
    // 描画用レイヤー(Base)のインデックス
    const drawingLayerIndex = mapJSON.layers.map((layer) => layer.name).indexOf('Base')

    if (mapJSON.layers[drawingLayerIndex].name === 'Base') {
      layerIdIndex = drawingLayerIndex
    }

    if (layerIdIndex === -1) {
      throw new Error('Baseをlayer名に持つlayerが存在しません')
    }

    const mapData = {
      path: pathToMapJSON,
      tilesets: mapJSON.tilesets[0].name,
      layerId: mapJSON.layers[layerIdIndex].name,
    }
    return mapData
  }
}
