import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'
import type { PlayerJoinData } from './playerJoinMessage'

interface ExistPlayers {
  [id: string]: PlayerJoinData
}

/**
 * サーバーから返されるPlayerの初期化データ
 */
interface PriorPlayerData extends SendableObject {
  existPlayers: ExistPlayers
}

export class PriorPlayerDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PriorPlayerData) {
    super('priorPlayerData', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    priorPlayerData: PriorPlayerDataMessage
  }
}
