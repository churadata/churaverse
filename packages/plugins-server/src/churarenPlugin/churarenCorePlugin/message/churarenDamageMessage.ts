import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { DamageCauseType, IMainScene } from 'churaverse-engine-server'

export interface ChurarenDamageData extends SendableObject {
  targetId: string
  cause: DamageCauseType
  sourceId: string
  amount: number
}

export class ChurarenDamageMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenDamageData) {
    super('churarenDamage', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    churarenDamage: ChurarenDamageMessage
  }
}
