import { ChurarenWeaponDamageCause, type ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import type { WeaponDamageCause } from 'churaverse-engine-server'

export class BlackHoleDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly blackHole: ChurarenWeaponEntity) {
    super('blackHole', blackHole)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    blackHole: WeaponDamageCause
  }
}
