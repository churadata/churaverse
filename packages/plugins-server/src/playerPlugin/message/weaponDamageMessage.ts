import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { DamageCauseType, IMainScene } from 'churaverse-engine-server'

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

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    weaponDamage: WeaponDamageMessage
  }
}
