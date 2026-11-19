import type { PersistenceKeyNames, PersistentDataMap } from '../types/persistentData'
import type { StorageValue } from '../types/storageValue'

export interface IDataPersistence {
  get: <PluginName extends keyof PersistentDataMap & string, KeyName extends PersistenceKeyNames<PluginName> & string>(
    pluginName: PluginName,
    keyName: KeyName
  ) => PersistentDataMap[PluginName][KeyName] | undefined
  /** データを追加する */
  add: <
    PluginName extends keyof PersistentDataMap & string,
    KeyName extends PersistenceKeyNames<PluginName> & string,
    DataType extends PersistentDataMap[PluginName][KeyName],
  >(
    pluginName: PluginName,
    keyName: KeyName,
    data: DataType extends StorageValue ? DataType : never
  ) => void
  /** データを削除する */
  delete: <PluginName extends keyof PersistentDataMap, KeyName extends PersistenceKeyNames<PluginName> & string>(
    pluginName: PluginName,
    keyName: KeyName
  ) => void
}
