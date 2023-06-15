import { IPersistStore } from '../../interactor/IPersistStore'
// クッキーの情報を管理するクラス
export class CookieStore implements IPersistStore {
  // クッキーの有効期限を二週間に設定する
  public constructor(private readonly maxAge = 14 * 24 * 60 * 60) {}

  public save(property: string, value: string): void {
    document.cookie = `${property}=${value};max-age=${this.maxAge};`
  }

  public read(property: string): string | undefined {
    const savedInfos = document.cookie.split(';')

    // propertyが一致するプレイヤー情報を検索
    for (const savedInfo of savedInfos) {
      const [key, value] = savedInfo.trim().split('=')
      if (key === property) {
        const info = decodeURIComponent(value)
        return info
      }
    }
  }
}
