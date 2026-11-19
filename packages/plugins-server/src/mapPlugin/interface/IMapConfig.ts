export interface MapInfo {
  displayName: string
  jsonName: string
  tileSetName: string
}

interface MapInfos {
  [mapId: string]: MapInfo
}

export interface IMapConfig {
  maps: MapInfos
}
