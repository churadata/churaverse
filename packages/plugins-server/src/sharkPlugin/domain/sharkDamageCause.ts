import { WeaponDamageCause, type WeaponEntity } from 'churaverse-engine-server'
export class SharkDamageCause extends WeaponDamageCause {
  public constructor(public readonly shark: WeaponEntity) {
    super('shark', shark)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    shark: WeaponDamageCause
  }
}
