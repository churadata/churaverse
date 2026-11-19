import { createStorage, type Storage } from 'unstorage'
// eslint-disable-next-line import/no-unresolved
import localStorageDriver from 'unstorage/drivers/localstorage'
import type { IDataPersistence } from './interface/IDataPersistence'
import type { PersistenceKeyNames, PersistentDataMap } from './types/persistentData'
import type { StorageValue } from './types/storageValue'

const localStorageKeyName: string = 'churaverseApp:'
export type PersistentData = Map<string, StorageValue>

export class DataPersistence implements IDataPersistence {
  private readonly storage: Storage
  // ここに保存するdataは、localStorageに含まれていたMapが格納される予定
  // dataPersistencePluginStoreに含める理由として、localStorageからデータを取り出して、最初の初期化の際にlocalStorageの内容を利用するためにdataを含めています
  private data: PersistentData

  public constructor() {
    this.storage = createStorage({
      driver: localStorageDriver({
        // base: 'app:',
      }),
    })
    this.data = new Map<string, StorageValue>()
  }

  /**
   * loadが呼ばれるのは、'init'イベントが呼ばれる最初の一度だけ
   * localStorageに含まれる内容を一括で取得
   */
  public async load(): Promise<PersistentData> {
    const storedData = (await this.storage.getItem<Record<string, StorageValue>>(localStorageKeyName)) ?? {}
    this.data = this.objectToMap(storedData)
    // valueのそれぞれの値に対してparseする
    this.data.forEach((value, key, map) => {
      map.set(key, this.parseValue(value))
    })
    return this.data
  }

  public get<
    PluginName extends keyof PersistentDataMap & string,
    KeyName extends PersistenceKeyNames<PluginName> & string,
  >(pluginName: PluginName, keyName: KeyName): PersistentDataMap[PluginName][KeyName] | undefined {
    return this.data.get(pluginName + keyName) as PersistentDataMap[PluginName][KeyName] | undefined
  }

  /**
   * saveは最後に一度だけ
   * 保存できるデータはStorageValue型のみ
   */
  public async save(): Promise<void> {
    // localStorageに保存できるようにmapからobjectに変換
    const data = this.mapToObject(this.data)
    await this.storage.setItem(localStorageKeyName, data)
  }

  /**
   * 受け取ったデータをデータを管理するMapへ追加する
   */
  public add<
    PluginName extends keyof PersistentDataMap & string,
    KeyName extends PersistenceKeyNames<PluginName> & string,
    DataType extends PersistentDataMap[PluginName][KeyName],
  >(pluginName: PluginName, keyName: KeyName, data: DataType extends StorageValue ? DataType : never): void {
    // クラスの持つ、mapに対してkeyに対応するデータをsetする
    this.data.set(pluginName + keyName, JSON.stringify(data))
  }

  public delete<
    PluginName extends keyof PersistentDataMap & string,
    KeyName extends PersistenceKeyNames<PluginName> & string,
  >(pluginName: PluginName, keyName: KeyName): void {
    this.data.delete(pluginName + keyName)
    void this.save()
  }

  /**
   * localStorageから取得したデータはobjectの状態になっているので、Mapに変換するために用意
   */

  private objectToMap(object: Record<string, StorageValue>): Map<string, StorageValue> {
    return new Map(Object.entries(object))
  }

  /**
   * localStorageに保存するデータはobjectにする必要があるので、Mapをobjectに変換するために用意
   */
  private mapToObject(map: PersistentData): Record<string, StorageValue> {
    return Object.fromEntries(map)
  }

  /**
   * valueがオブジェクトの場合、再起的にparseを行う
   */
  private parseValue(value: any): any {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value)
      } catch (_e) {
        return value // JSONとしてパースできない場合は、そのまま値を返す
      }
    } else if (Array.isArray(value)) {
      return value.map(this.parseValue.bind(this))
    } else if (typeof value === 'object' && value !== null) {
      const parsedObj: { [key: string]: any } = {}
      for (const key in value) {
        parsedObj[key] = this.parseValue(value[key])
      }
      return parsedObj
    } else {
      return value
    }
  }
}
