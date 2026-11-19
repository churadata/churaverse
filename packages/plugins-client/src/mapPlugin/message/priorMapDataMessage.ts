import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

/**
 * サーバーから返されるMapの初期化データ
 */
export interface PriorMapData extends SendableObject {
  mapId: string
}

export class PriorMapDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PriorMapData) {
    super('priorMapData', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    priorMapData: PriorMapDataMessage
  }
}
