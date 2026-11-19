import type { WeaponEntity } from 'churaverse-engine-server'

/**
 * 武器かどうかを判定する
 * @param entity 判定対象のエンティティ
 * @returns 武器の場合true
 */
export function isWeaponEntity(entity: any): entity is WeaponEntity {
  return (
    'id' in entity &&
    typeof entity.id === 'string' &&
    'ownerId' in entity &&
    typeof entity.ownerId === 'string' &&
    'power' in entity &&
    typeof entity.power === 'number'
  )
}
