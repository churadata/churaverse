import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { DamageCauseType, IMainScene } from 'churaverse-engine-client'

export interface WeaponDamageData extends SendableObject {
  targetId: string
  cause: DamageCauseType
  weaponId: string
  amount: number
}

export class WeaponDamageMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: WeaponDamageData) {
    super('weaponDamage', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    weaponDamage: WeaponDamageMessage
  }
}
