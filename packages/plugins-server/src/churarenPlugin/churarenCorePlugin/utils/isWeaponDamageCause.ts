import { WeaponDamageCause } from 'churaverse-engine-server'
import { isWeaponEntity } from './isWeaponEntity'

/**
 * 受け取った引数がWeaponDamageCauseクラスかどうかを判定する
 * @param entity 判定対象のエンティティ
 * @returns WeaponDamageCauseクラスの場合true
 */
export function isWeaponDamageCause(entity: any): entity is WeaponDamageCause {
  return entity instanceof WeaponDamageCause && isWeaponEntity(entity.weapon)
}
