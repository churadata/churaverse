import { WeaponDamageCause, type WeaponEntity } from 'churaverse-engine-server'

export class BombDamageCause extends WeaponDamageCause {
  public constructor(public readonly bomb: WeaponEntity) {
    super('bomb', bomb)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    bomb: WeaponDamageCause
  }
}
