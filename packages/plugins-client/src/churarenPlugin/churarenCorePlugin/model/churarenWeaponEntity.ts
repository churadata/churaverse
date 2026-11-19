/**
 * ちゅられんの武器エンティティ
 * @param churarenWeaponOwnerId 武器を持っているユーザーのID
 * @param power 武器のダメージ
 */
export interface ChurarenWeaponEntity {
  readonly churarenWeaponOwnerId: string // 武器を持っているユーザーのID
  readonly power: number // 武器のダメージ
}
