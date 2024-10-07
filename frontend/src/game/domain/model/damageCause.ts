import { KnownKeyOf } from '../../utilTypes/knownKeyOf'

/**
 * ダメージの原因の抽象クラス
 */
export abstract class DamageCause {
  public constructor(public readonly name: DamageCauseType) {}
}

/**
 * ダメージの原因とその名前("shark"や"bomb"等)
 */
export interface DamageCauseMap {
  [key: string]: DamageCause
}
export type DamageCauseType = KnownKeyOf<DamageCauseMap>
