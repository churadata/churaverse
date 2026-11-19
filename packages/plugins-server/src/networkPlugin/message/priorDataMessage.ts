import type { Scenes } from 'churaverse-engine-server'
import { BaseMessage } from './baseMessage'

/**
 * Sceneの初期化に利用するデータをサーバーに要求するMessage
 */
export class PriorDataRequestMessage extends BaseMessage<Scenes> {
  public constructor() {
    super('requestPriorData')
  }
}

declare module './messages' {
  export interface MainMessageMap {
    requestPriorData: PriorDataRequestMessage
  }

  export interface TitleMessageMap {
    requestPriorData: PriorDataRequestMessage
  }
}
