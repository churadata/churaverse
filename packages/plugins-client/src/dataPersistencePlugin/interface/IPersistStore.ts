// プレイヤー情報を永続化するためのinterface
export interface IPersistStore {
  save: (property: string, value: string) => void
  read: (property: string) => string | undefined
}
