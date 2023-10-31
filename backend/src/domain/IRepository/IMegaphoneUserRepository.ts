/**
 * メガホン機能がONになっているユーザのidを保持する
 */
export interface IMegaphoneUserRepository {
  set: (id: string, active: boolean) => void
  delete: (id: string) => void

  /**
   * メガホン機能がONになっている場合true
   */
  isUsingMegaphone: (id: string) => boolean

  toObject: () => { [id: string]: boolean }
}
