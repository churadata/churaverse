export interface MapInfo {
  displayName: string
  jsonName: string
  /**
   * tileset名. マップチップの画像名も同じである必要がある
   */
  tilesets: string[]
  /**
   * 描画するレイヤー名
   */
  drawingLayerNames?: string[]
}

interface MapInfos {
  [mapId: string]: MapInfo
}

export interface IMapConfig {
  maps: MapInfos
}
