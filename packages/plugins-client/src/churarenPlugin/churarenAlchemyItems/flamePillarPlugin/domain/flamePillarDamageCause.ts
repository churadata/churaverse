import { ChurarenWeaponDamageCause, type ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'
import type { WeaponDamageCause } from 'churaverse-engine-client'

export class FlamePillarDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly flamePillar: ChurarenWeaponEntity) {
    super('flamePillar', flamePillar)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    flamePillar: WeaponDamageCause
  }
}
