import { ChurarenWeaponDamageCause, type ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import type { WeaponDamageCause } from 'churaverse-engine-server'

export class TornadoDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly tornado: ChurarenWeaponEntity) {
    super('tornado', tornado)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    tornado: WeaponDamageCause
  }
}
