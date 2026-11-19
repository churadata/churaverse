import { DamageCause, DamageCauseType } from './damageCause'
import { WeaponEntity } from './weaponEntity'

/**
 * 武器によるダメージの抽象クラス
 */
export abstract class WeaponDamageCause extends DamageCause {
  public constructor(public readonly weaponName: DamageCauseType, public readonly weapon: WeaponEntity) {
    super(weaponName)
  }
}
