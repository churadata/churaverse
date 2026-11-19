import { ChurarenWeaponDamageCause, type ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import type { WeaponDamageCause } from 'churaverse-engine-server'

export class IceArrowDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly iceArrow: ChurarenWeaponEntity) {
    super('iceArrow', iceArrow)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    iceArrow: WeaponDamageCause
  }
}
