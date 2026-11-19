// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PersistentDataMap {}

// pluginName
// eslint-disable-next-line @typescript-eslint/no-empty-interface
/**
 * { プラグイン名 : プラグインが持つkey名とそのデータの型のmap }
 */
export type PluginName = PersistentDataMap & { [type: string]: string }

// keyName
// eslint-disable-next-line @typescript-eslint/no-empty-interface
/**
 * 各プラグインが持つkey名のユニオン型
 */
export type PersistenceKeyNames<PluginName extends keyof PersistentDataMap> = keyof PersistentDataMap[PluginName]
