/**
 * メガホン機能がONになっているユーザのidを保持する
 */
export interface IMegaphoneUserRepository {
  add: (id: string) => void
  delete: (id: string) => void

  /**
   * メガホン機能がONになっている場合true
   */
  isUsingMegaphone: (id: string) => boolean

  getIds: () => string[]
}
