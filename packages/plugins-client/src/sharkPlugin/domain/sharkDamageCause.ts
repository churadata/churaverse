import { WeaponDamageCause, type WeaponEntity } from 'churaverse-engine-client'

export class SharkDamageCause extends WeaponDamageCause {
  public constructor(public readonly shark: WeaponEntity) {
    super('shark', shark)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    shark: WeaponDamageCause
  }
}
