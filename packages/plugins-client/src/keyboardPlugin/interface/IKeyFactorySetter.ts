import type { IKeyFactory } from './IKeyFactory'

export interface IKeyFactorySetter {
  /**
   * KeyFactoryを設定する
   */
  set: (keyFactory: IKeyFactory) => void
}
