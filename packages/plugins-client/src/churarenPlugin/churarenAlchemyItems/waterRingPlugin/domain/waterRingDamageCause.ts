import { ChurarenWeaponDamageCause, type ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'
import type { WeaponDamageCause } from 'churaverse-engine-client'

export class WaterRingDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly waterRing: ChurarenWeaponEntity) {
    super('waterRing', waterRing)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    waterRing: WeaponDamageCause
  }
}
