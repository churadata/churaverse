import type { WeaponEntity } from 'churaverse-engine-client'

/**
 * 武器かどうかを判定する
 * @param entity 判定対象のエンティティ
 * @returns 武器であればtrue
 */
export function isWeaponEntity(entity: any): entity is WeaponEntity {
  return (
    'ownerId' in entity && typeof entity.ownerId === 'string' && 'power' in entity && typeof entity.power === 'number'
  )
}
