/**
 * ちゅられん用の武器となるもののインターフェース
 * @param id 武器のID(ICollidableEntityと揃えるため)
 * @param churarenWeaponOwnerId 武器を持っているユーザーのID
 * @param power 武器のダメージ
 */
export interface ChurarenWeaponEntity {
  readonly id: string // 武器のID
  readonly churarenWeaponOwnerId: string // 武器を持っているユーザーのID
  readonly power: number // 武器のダメージ
}
