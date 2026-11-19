/**
 * 武器となるもののインタフェース
 */
export interface WeaponEntity {
  readonly id: string
  readonly ownerId: string
  readonly power: number
}
