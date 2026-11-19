import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

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

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    priorMapData: PriorMapDataMessage
  }
}
