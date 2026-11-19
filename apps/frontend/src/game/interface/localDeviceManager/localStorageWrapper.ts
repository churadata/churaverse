export class LocalStorageWrapper<T extends string> {
  private readonly key: string

  public constructor(key: string) {
    this.key = key
  }

  public set(v: T): void {
    localStorage.setItem(this.key, v)
  }

  public get(): T | undefined {
    return localStorage.getItem(this.key) as T | undefined
  }
}
