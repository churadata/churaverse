import { WeaponDamageCause, type WeaponEntity } from 'churaverse-engine-client'

export class BombDamageCause extends WeaponDamageCause {
  public constructor(public readonly bomb: WeaponEntity) {
    super('bomb', bomb)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    bomb: WeaponDamageCause
  }
}
