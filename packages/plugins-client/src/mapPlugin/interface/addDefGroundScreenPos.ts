import type { Vector } from 'churaverse-engine-client'

// groundScreenPlugin が使うオプション設定をMapInfoに追加
declare module './IMapConfig' {
  export interface MapInfo {
    groundScreenPos?: Vector
  }
}
