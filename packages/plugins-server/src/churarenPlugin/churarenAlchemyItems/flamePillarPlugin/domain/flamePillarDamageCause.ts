import { ChurarenWeaponDamageCause, type ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import type { WeaponDamageCause } from 'churaverse-engine-server'

export class FlamePillarDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly flamePillar: ChurarenWeaponEntity) {
    super('flamePillar', flamePillar)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    flamePillar: WeaponDamageCause
  }
}
