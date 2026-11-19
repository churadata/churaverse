import { ChurarenWeaponDamageCause, type ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'
import type { WeaponDamageCause } from 'churaverse-engine-client'

export class BlackHoleDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly blackHole: ChurarenWeaponEntity) {
    super('blackHole', blackHole)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    blackHole: WeaponDamageCause
  }
}
